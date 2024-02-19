/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

/* A little ammend by mizphses 2024-02-19 */

import { base64, base64url } from 'rfc4648'

const cache = new Map<symbol, any>()

/**
 * Decodes a base64 encoded JSON key into an object memoizing the return value.
 * https://cloud.google.com/iam/docs/creating-managing-service-account-keys
 */
function decodeCredentials(
  env: {
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: string
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string
    GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: string
    GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: string
  },
  value: string
): Credentials {
  const key = Symbol.for(`credentials:${value}`)
  let credentials = cache.get(key) as Credentials | undefined

  if (!credentials) {
    const credentials_base = {
      type: 'service_account',
      client_email: env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      private_key_str: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      private_key_id: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      project_id: env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
      client_id: env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
      universe_domain: 'googleapis.com',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURI(env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL)}`,
      private_key: null as unknown as ArrayBuffer,
    }
    const keyBase64 = credentials_base.private_key_str
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace(/\n/g, '')
    credentials_base.private_key = base64.parse(keyBase64)
    credentials = credentials_base
    cache.set(key, credentials)
  }

  return credentials
}

/**
 * Returns a `CryptoKey` object that you can use in the `Web Crypto API`.
 * https://developer.mozilla.org/docs/Web/API/SubtleCrypto
 *
 * @example
 *   const credentials = decodeCredentials(env.GOOGLE_CLOUD_CREDENTIALS);
 *   const signKey = await importKey(credentials, ["sign"]);
 */
async function importKey(credentials: Credentials, usages: Usage[]): Promise<CryptoKey> {
  const key = Symbol.for(`cryptoKey:${usages.sort().join(',')}`)
  let cryptoKey = cache.get(key) as CryptoKey | undefined

  if (!cryptoKey) {
    cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      credentials.private_key,
      { name: 'RSASSA-PKCS1-V1_5', hash: 'SHA-256' },
      false,
      usages
    )

    cache.set(key, cryptoKey)
  }

  return cryptoKey
}

async function sign(credentials: Credentials, data: string): Promise<string> {
  const dataArray = new TextEncoder().encode(data)
  const key = await importKey(credentials, ['sign'])
  const buff = await self.crypto.subtle.sign(key.algorithm, key, dataArray)
  return base64url.stringify(new Uint8Array(buff), { pad: false })
}

/**
 * Retrieves an authentication token from OAuth 2.0 authorization server.
 * https://developers.google.com/identity/protocols/oauth2/service-account
 *
 * @example
 *   const scope = "https://www.googleapis.com/auth/cloud-platform";
 *   const token = await getAuthToken(env, scope);
 *   const headers = { Authorization: `Bearer ${token.accessToken}` };
 *   const res = await fetch(url, { headers });
 */

async function getAuthToken<T extends AccessToken | IdToken = AccessToken>(
  env: {
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: string
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string
    GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: string
    GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: string
  },
  scope: string | string[]
): Promise<T> {
  const credentials = decodeCredentials(env, 'test')
  const scopes = Array.isArray(scope) ? scope.join(' ') : scope
  const cacheKey = Symbol.for(`token:${credentials.private_key_id}:${scopes}`)
  const issued = Math.floor(Date.now() / 1000)
  let authToken = cache.get(cacheKey) as T | undefined

  if (!authToken || authToken.expires < issued - 10) {
    const expires = issued + 3600 // Max 1 hour
    const claims = self
      .btoa(
        JSON.stringify({
          iss: credentials.client_email,
          scope: scopes,
          aud: credentials.token_uri,
          exp: expires,
          iat: issued,
        })
      )
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    const header = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9` // {"alg":"RS256","typ":"JWT"}
    const payload = `${header}.${claims}`
    const signature = await sign(credentials, payload)

    const body = new FormData()
    body.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer')
    body.append('assertion', `${payload}.${signature}`)

    const res = await fetch(credentials.token_uri, { method: 'POST', body })

    if (res.status !== 200) {
      const data = (await res.json()) as { error: string; error_description: string }
      throw new Error(data.error_description)
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const data = (await res.json()) as any
    authToken = data.access_token
      ? ({
          accessToken: data.access_token.replace(/\.+$/, ''),
          type: data.token_type,
          expires,
        } as T)
      : ({
          idToken: data.id_token.replace(/\.+$/, ''),
          audience: scope,
          expires,
        } as T)

    cache.set(cacheKey, authToken)
  }

  return authToken
}

interface Credentials {
  client_email: string
  private_key: ArrayBuffer
  private_key_id: string
  token_uri: string
}

type AccessToken = {
  accessToken: string
  type: string
  expires: number
}

type IdToken = {
  idToken: string
  audience: string
  expires: number
}

type Usage = 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'deriveKey' | 'deriveBits' | 'wrapKey' | 'unwrapKey'

export { decodeCredentials, getAuthToken, importKey, sign }
export type { AccessToken, IdToken }

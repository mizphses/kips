import { AccessToken, getAuthToken } from './googleAuth.lib'
import * as jose from 'jose'
import { GenericClass, GenericObject } from './types/pass'

export async function createPassClass(classSlug: string, issuerId: string, token: AccessToken, genericClass: GenericClass) {
  const classId = `${issuerId}.${classSlug}`
  const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1'
  // TODO: Create a Generic pass class

  let response
  try {
    // Check if the class exists already
    response = await fetch(`${baseUrl}/genericClass/${classId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    })
    if (response.status === 200) {
      console.error('Class already exists')
    }
    if (response.status === 404) {
      // Class does not exist
      // Create it now
      // response = await httpClient.request({
      //   url: `${baseUrl}/genericClass`,
      //   method: 'POST',
      //   data: genericClass,
      // })

      response = await fetch(`${baseUrl}/genericClass`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
        body: JSON.stringify(genericClass),
      })
      return { result: true, classJson: genericClass }
    } else {
      return {
        result: false,
        classJson: null,
      }
    }
  } catch (e) {
    console.error(e)
    return {
      result: false,
      classJson: null,
    }
  }
}

export async function createPassObject(genericObject: GenericObject, sa_privkey: string, sa_email: string) {
  // TODO: Create the signed JWT and link
  const claims = {
    iss: sa_email,
    aud: 'google',
    origins: [],
    typ: 'savetowallet',
    payload: {
      genericObjects: [genericObject],
    },
  }
  const privateKey = await jose.importPKCS8(sa_privkey, 'RS256')

  const token = await new jose.SignJWT(claims).setProtectedHeader({ alg: 'RS256' }).sign(privateKey)
  const saveUrl = `https://pay.google.com/gp/v/save/${token}`
  return saveUrl
}

export const getToken = async (c: {
  env: {
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: string
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string
    GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: string
    GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: string
  }
}) => {
  const scope = ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/wallet_object.issuer']

  const authInfo = {
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: c.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
    GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
  }
  return await getAuthToken(authInfo, scope)
}

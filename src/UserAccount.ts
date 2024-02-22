import { sha3_512 } from 'js-sha3'
import * as jose from 'jose'

type User = {
  email: string
  password: string
}

const createApiKey = (pepper: string) => {
  const apiKeyBase = sha3_512(pepper + Date.now())
  const apiKey = sha3_512(apiKeyBase + pepper + Date.now())
  return apiKey
}

export const RegisterUser = async (userInfo: User, pepper: string, kv_user: KVNamespace, kv_keys: KVNamespace, kv_kbm: KVNamespace) => {
  const email = userInfo.email
  const password = userInfo.password
  const hashedPassword = sha3_512(password + pepper)
  const apiKey = createApiKey(pepper)
  const storedPassword = await kv_user.get(email)
  if (storedPassword === null) {
    await kv_user.put(email, hashedPassword)
    await kv_keys.put(email, apiKey)
    await kv_kbm.put(apiKey, email)
    return true
  } else {
    return false
  }
}

export const getUserSecret = async (token: string, kv_keys: KVNamespace) => {
  const decodedToken = jose.decodeJwt(token)
  const email = decodedToken.sub || ''
  const apiKey = await kv_keys.get(email)
  return apiKey
}

export const authUserByToken = async (token: string, secretText: string, kv_users: KVNamespace) => {
  const secret = new TextEncoder().encode(secretText)
  // tokenの署名を検証する
  const result = await jose.jwtVerify(token, secret).then(
    (result) => {
      return true
    },
    (error) => {
      console.error(error)
      return false
    }
  )
  if (!result) {
    return false
  }
  const email = jose.decodeJwt(token).sub || ''
  const userInfo = await kv_users.get(email)
  if (userInfo === null) {
    return false
  } else {
    return true
  }
}

export const authUserByMail = async (email: string, password: string, pepper: string, kv_user: KVNamespace) => {
  const hashedPassword = sha3_512(password + pepper)
  const storedPassword = await kv_user.get(email)
  if (hashedPassword === storedPassword) {
    return true
  } else {
    return false
  }
}

export const getUserByKey = async (apiKey: string, kv_kbm: KVNamespace) => {
  const user = await kv_kbm.get(apiKey)
  return user
}

export const revokeKey = async (email: string, pepper: string, kv_keys: KVNamespace, kv_kbm: KVNamespace) => {
  const apiKey = await kv_keys.get(email)
  if (apiKey === null) {
    return false
  }
  await kv_keys.delete(email)
  await kv_kbm.delete(apiKey)

  const newApiKey = createApiKey(pepper)
  await kv_keys.put(email, newApiKey)
  await kv_kbm.put(newApiKey, email)
  return true
}

export const createToken = async (email: string, secretText: string) => {
  const secret = new TextEncoder().encode(secretText)
  const jwtContent = {
    sub: email,
  }
  const userJwt = await new jose.SignJWT(jwtContent)
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret)
  return userJwt
}

export const tokenAuth = async (authHeader: string, secret: string, kv_logins: KVNamespace) => {
  if (authHeader === null || authHeader === undefined) {
    return { result: false, token: '' }
  }
  const token = authHeader.split(' ')[1]
  const userExists = await authUserByToken(token, secret, kv_logins)
  if (!userExists) {
    return { result: false, token: token }
  }
  return { result: true, token: token }
}

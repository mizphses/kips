import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Bindings } from './bindings'
import { createPassClass, createPassObject, getToken } from './googlePay'
import { RegisterUser, authUserByMail, tokenAuth, createToken, getUserSecret, getUserByKey } from './UserAccount'
import { GenericClassRequest, GenericObjectRequest } from './types/pass'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'X-Api-Key'],
  })
)

app.get('/', () => {
  return new Response(
    JSON.stringify({
      message: 'Welcome to the Kips API',
      health: 'working, at least of this endpoint.',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
})

type User = {
  email: string
  password: string
}

// 認証関係
app.post('/users/create', async (c) => {
  const userInfo = await c.req.json<User>()
  if (await RegisterUser(userInfo, c.env.PW_PEPPER, c.env.KIPS_LOGINS, c.env.KIPS_KEYS, c.env.KIPS_KEY_BY_MAIL)) {
    return new Response(
      JSON.stringify({
        message: 'User Created',
        mail: userInfo.email,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } else {
    return new Response(
      JSON.stringify({
        message: 'User Creation Failed',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
})

app.post('/users/login', async (c) => {
  const userInfo = await c.req.json<User>()
  if (await authUserByMail(userInfo.email, userInfo.password, c.env.PW_PEPPER, c.env.KIPS_LOGINS)) {
    const token = await createToken(userInfo.email, c.env.JWT_SECRET)
    return new Response(
      JSON.stringify({
        message: 'Login Success',
        token: token,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } else {
    return new Response(
      JSON.stringify({
        message: 'Login Failed',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
})

app.post('/users/apiKey', async (c) => {
  const authHeader = c.req.header('Authorization') || ''
  const { result, token } = await tokenAuth(authHeader, c.env.JWT_SECRET, c.env.KIPS_LOGINS)
  if (result === false) {
    return new Response(
      JSON.stringify({
        message: 'Authorization Failed',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
  const apiKey = await getUserSecret(token, c.env.KIPS_KEYS)
  if (apiKey === null) {
    return new Response(
      JSON.stringify({
        message: 'API Key Not Found. Ask your administrator.',
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } else {
    return new Response(
      JSON.stringify({
        message: 'API Key Found',
        apiKey: apiKey,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
})

// Google Pay パスクラス作成
app.get('/pass-class/create', async (c) => {
  const authHeader = c.req.header('X-Api-Key') || ''
  const email = await getUserByKey(authHeader, c.env.KIPS_KEY_BY_MAIL)
  if (email === null) {
    return new Response(
      JSON.stringify({
        message: 'Authorization Failed',
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
  const token = await getToken(c)
  const passClassId = uuidv4()
  const genericClassRequest = await c.req.json<GenericClassRequest>()
  const genericClass = {
    ...genericClassRequest,
    id: passClassId || '',
  }
  const { result, classJson } = await createPassClass(passClassId, c.env.GOOGLE_PAY_ISSUER_ID, token, genericClass)
  let message = ''
  let status = 200
  if (!result) {
    message = 'Pass Class Creation Failed'
    status = 500
  } else {
    message = 'Pass Class Created'
    const passClassText = JSON.stringify(classJson)
    await c.env.KIPS_PASS_CLASS.put(passClassId, passClassText)
  }
  return new Response(
    JSON.stringify({
      message: message,
      classJson,
    }),
    {
      status: status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
})

// Google Pay パスオブジェクト作成
app.get('/pass-object/create', async (c) => {
  const genericObjectRequest = await c.req.json<GenericObjectRequest>()
  const objectId = uuidv4()
  const genericObject = {
    ...genericObjectRequest,
    id: objectId,
  }
  if (c.env.KIPS_PASS_CLASS.get(genericObject.classId) === null) {
    return new Response(
      JSON.stringify({
        message: 'Pass Class Not Found',
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
  const sa_email = c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL
  const sa_privkey = c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const passObject = await createPassObject(genericObject, sa_privkey, sa_email)
  const passObjectText = JSON.stringify(passObject)
  await c.env.KIPS_PASS_OBJECT.put(objectId, passObjectText)
  return new Response(
    JSON.stringify({
      message: 'Pass Object Created',
      passObject: passObject,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
})
export default app

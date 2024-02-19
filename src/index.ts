import { Hono } from 'hono'
import { Bindings } from './bindings'
import { createPassClass, createPassObject } from './googlePay'
import { getAuthToken } from './googleAuth'

const app = new Hono<{ Bindings: Bindings }>()

const scope = ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/wallet_object.issuer']

const getToken = async (c: any) => {
  const authInfo = {
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: c.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
    GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
  }
  return await getAuthToken(authInfo, scope)
}

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

app.get('/create-pass-class', async (c: any) => {
  const token = await getToken(c)
  const passClass = await createPassClass(c.env.GOOGLE_PAY_ISSUER_ID, token)
  let message = ''
  let status = 200
  if (!passClass) {
    message = 'Pass Class Creation Failed'
    status = 500
  } else {
    message = 'Pass Class Created'
  }
  return new Response(
    JSON.stringify({
      message: message,
      passClass,
    }),
    {
      status: status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
})

app.get('/create-pass-object', async (c: any) => {
  const sa_email = c.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL
  const sa_privkey = c.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  const passObject = await createPassObject(
    c.env.GOOGLE_PAY_ISSUER_ID,
    `${c.env.GOOGLE_PAY_ISSUER_ID}.codelab_class`,
    'codelab_object',
    'Hello World',
    sa_privkey,
    sa_email
  )

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

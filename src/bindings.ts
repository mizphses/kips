export type Bindings = {
  KIPS_KEYS: KVNamespace
  KIPS_LOGINS: KVNamespace
  KIPS_KEY_BY_MAIL: KVNamespace
  KIPS_PASS_CLASS: KVNamespace
  KIPS_PASS_OBJECT: KVNamespace
  GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: string
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string
  GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: string
  GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: string
  GOOGLE_PAY_ISSUER_ID: string
  PW_PEPPER: string
  JWT_SECRET: string
}

declare global {
  function getMiniflareBindings(): Bindings
}

export type Bindings = {
  KIPS_KEYS: KVNamespace
  GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: string
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID: string
  GOOGLE_SERVICE_ACCOUNT_PROJECT_ID: string
  GOOGLE_SERVICE_ACCOUNT_CLIENT_ID: string
  GOOGLE_PAY_ISSUER_ID: string
}

declare global {
  function getMiniflareBindings(): Bindings
}

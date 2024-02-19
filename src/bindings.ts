export type Bindings = {
  KIPS_KEYS: KVNamespace,
	
}

declare global {
  function getMiniflareBindings(): Bindings
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMetaEnv {
    // available in testing only
	readonly NODE_ENV: "test" |   (string & {})
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {
	readonly env: ImportMetaEnv
}

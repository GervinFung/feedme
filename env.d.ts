interface ImportMetaEnv {
    // available in testing only
	readonly NODE_ENV: "test" |   (string & {})
}
interface ImportMeta {
	readonly env: ImportMetaEnv
}

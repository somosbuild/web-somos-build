/** Prefix a public asset path with the deploy base path (set NEXT_PUBLIC_BASE_PATH when hosting under a sub-path). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;

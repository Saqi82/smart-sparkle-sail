/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANDROID_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

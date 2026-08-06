/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AIGC_GATEWAY?: string;
  readonly VITE_AIGC_GATEWAY_TARGET?: string;
  readonly VITE_TEMP_API?: string;
  readonly VITE_TEMP_API_TARGET?: string;
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_BASE?: string;
  readonly VITE_APP_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

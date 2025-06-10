declare global {
  interface Window {
    API_URL: string;
    gapi: any;
    fbAsyncInit: () => void;
  }

  // Environment variables types
  interface ImportMetaEnv {
    VITE_API_URL: string;
    VITE_ENVIRONMENT: 'development' | 'staging' | 'production';
    VITE_PLUNK_API_KEY?: string;
    VITE_UMAMI_WEBSITE_ID?: string;
    VITE_UMAMI_URL?: string;
    [key: string]: any;
  }

  // Import meta extended with env
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};

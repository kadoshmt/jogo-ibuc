declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    ENCRYPTION_KEY: string;
    PAINEL_URL: string;
    GAME_WEB_URL: string;
    DEFAULT_AVATAR_URL: string;
    DATABASE_URL: string;
    JWT_SECRET_KEY: string;
    JWT_EXPIRES_IN: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_REDIRECT_URI?: string;
    GMAIL_REDIRECT_URI?: string;
    GMAIL_EMAIL_FROM?: string;
    GMAIL_EMAIL_REPLY_TO?: string;
    MICROSOFT_CLIENT_ID?: string;
    MICROSOFT_CLIENT_SECRET?: string;
    MICROSOFT_REDIRECT_URI?: string;
    FACEBOOK_APP_ID?: string;
    FACEBOOK_APP_SECRET?: string;
    FACEBOOK_REDIRECT_URI?: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_R2_PUBLIC_URL: string;
  }
}

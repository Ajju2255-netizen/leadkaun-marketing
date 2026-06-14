export const APP_URLS = {
  login:    process.env.NEXT_PUBLIC_APP_LOGIN_URL    ?? 'http://localhost:3000/login',
  register: process.env.NEXT_PUBLIC_APP_REGISTER_URL ?? 'http://localhost:3000/register',
  app:      process.env.NEXT_PUBLIC_APP_URL          ?? 'http://localhost:3000',
} as const

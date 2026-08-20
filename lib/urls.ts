export const APP_URLS = {
  login:    process.env.NEXT_PUBLIC_APP_LOGIN_URL    ?? 'http://localhost:3000/login',
  register: process.env.NEXT_PUBLIC_APP_REGISTER_URL ?? 'http://localhost:3000/register',
  app:      process.env.NEXT_PUBLIC_APP_URL          ?? 'http://localhost:3000',
  /**
   * Where the hero signup form POSTs. Not a page: the app creates the account,
   * signs the visitor in and redirects them into onboarding. A plain form post
   * to the app's own host is what lets it set a first party session cookie.
   */
  signup:   `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/auth/signup`,
} as const

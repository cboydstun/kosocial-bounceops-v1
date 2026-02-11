/**
 * Platform configuration for KoSocial white-label integration
 */

export function getPlatformUrl(): string {
  const url = process.env.NEXT_PUBLIC_PLATFORM_URL || 'https://slowbill.xyz'
  return url.replace(/\/$/, '') // Remove trailing slash
}

export function getSignupUrl(): string {
  return `${getPlatformUrl()}/api/v1/auth/signup`
}

export function getSignupSource(): string {
  return 'kosocial'
}

export const PLATFORM_URL = getPlatformUrl()
export const SIGNUP_URL = getSignupUrl()
export const SIGNUP_SOURCE = getSignupSource()

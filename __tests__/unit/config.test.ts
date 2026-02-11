import { getPlatformUrl, getSignupUrl, getSignupSource } from '@/lib/config'

describe('Config', () => {
  describe('getPlatformUrl', () => {
    it('should return platform URL from environment variable', () => {
      const url = getPlatformUrl()
      expect(url).toBe('https://slowbill.xyz')
    })

    it('should not have trailing slash', () => {
      const url = getPlatformUrl()
      expect(url).not.toMatch(/\/$/)
    })
  })

  describe('getSignupUrl', () => {
    it('should return signup API endpoint', () => {
      const url = getSignupUrl()
      expect(url).toBe('https://slowbill.xyz/api/v1/auth/signup')
    })

    it('should have correct path structure', () => {
      const url = getSignupUrl()
      expect(url).toContain('/api/v1/auth/signup')
    })
  })

  describe('getSignupSource', () => {
    it('should return kosocial as signup source', () => {
      const source = getSignupSource()
      expect(source).toBe('kosocial')
    })
  })
})

import '@testing-library/jest-dom'

// Mock window.location.assign to prevent jsdom navigation errors
const mockLocationAssign = jest.fn()
delete (window as any).location
;(window as any).location = { assign: mockLocationAssign }

// Export the mock so tests can access it
;(global as any).mockLocationAssign = mockLocationAssign

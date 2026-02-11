import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignupForm from '@/components/SignupForm'
import { getSignupUrl, getSignupSource } from '@/lib/config'

// Mock fetch
global.fetch = jest.fn()

// Get the mockLocationAssign from global (set in jest.setup.ts)
const mockLocationAssign = (global as any).mockLocationAssign

describe('SignupForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocationAssign.mockClear()
  })

  it('should render all form fields', () => {
    render(<SignupForm />)

    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('should submit form with correct data including signup source', async () => {
    const mockResponse = {
      success: true,
      tenant: { slug: 'test-tenant' }
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    render(<SignupForm />)

    const businessName = screen.getByLabelText(/business name/i)
    const email = screen.getByLabelText(/email/i)
    const password = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    fireEvent.change(businessName, { target: { value: 'Test Business' } })
    fireEvent.change(email, { target: { value: 'test@example.com' } })
    fireEvent.change(password, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        getSignupUrl(),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            businessName: 'Test Business',
            email: 'test@example.com',
            password: 'password123',
            signupSource: getSignupSource()
          })
        })
      )
    })
  })

  it('should successfully complete signup with valid response', async () => {
    const mockResponse = {
      success: true,
      tenant: { slug: 'test-tenant' }
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    render(<SignupForm />)

    const businessName = screen.getByLabelText(/business name/i)
    const email = screen.getByLabelText(/email/i)
    const password = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    fireEvent.change(businessName, { target: { value: 'Test Business' } })
    fireEvent.change(email, { target: { value: 'test@example.com' } })
    fireEvent.change(password, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Verify fetch was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    // Verify no error message is shown
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
  })

  it('should display error message on API failure', async () => {
    const mockError = {
      error: 'Email already exists'
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError
    })

    render(<SignupForm />)

    const businessName = screen.getByLabelText(/business name/i)
    const email = screen.getByLabelText(/email/i)
    const password = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    fireEvent.change(businessName, { target: { value: 'Test Business' } })
    fireEvent.change(email, { target: { value: 'test@example.com' } })
    fireEvent.change(password, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    })
  })

  it('should disable submit button while submitting', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(resolve, 1000))
    )

    render(<SignupForm />)

    const businessName = screen.getByLabelText(/business name/i)
    const email = screen.getByLabelText(/email/i)
    const password = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign up/i })

    fireEvent.change(businessName, { target: { value: 'Test Business' } })
    fireEvent.change(email, { target: { value: 'test@example.com' } })
    fireEvent.change(password, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
  })
})

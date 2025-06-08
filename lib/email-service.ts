import emailjs from '@emailjs/browser'

// Types for email service responses
type EmailResponse = {
  success: true
  code: string
} | {
  success: false
  error: string
  code?: never
}

// Initialize EmailJS with your public key
// You'll need to replace these with your actual EmailJS credentials
const EMAILJS_PUBLIC_KEY = '52Zoc0x4Np6sijp64'
const EMAILJS_SERVICE_ID = 'service_4knjly6'
const EMAILJS_TEMPLATE_ID = 'template_spapoir'

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

// Generate a numeric verification code
const generateVerificationCode = () => {
  const length = 6 // Length of the code
  let code = ''
  
  // Generate random digits
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10) // Random digit 0-9
  }
  
  console.log('Generated verification code:', code) // Debug log
  return code
}

export const sendVerificationEmail = async (
  toEmail: string,
  userName: string,
  verificationCode: string = generateVerificationCode()
): Promise<EmailResponse> => {
  if (!toEmail || !toEmail.includes('@')) {
    return { success: false, error: 'Invalid email address' }
  }

  // Validate EmailJS configuration
  const serviceId = EMAILJS_SERVICE_ID
  const templateId = EMAILJS_TEMPLATE_ID
  const publicKey = EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    console.error('EmailJS configuration missing:', {
      hasServiceId: !!serviceId,
      hasTemplateId: !!templateId,
      hasPublicKey: !!publicKey
    })
    return { 
      success: false, 
      error: 'Email service is not properly configured. Please check environment variables.' 
    }
  }

  try {
    const templateParams = {
      to_email: toEmail,
      user_name: userName,
      code: verificationCode,
      app: 'Inkly',
      verify_link: `${window.location.origin}/verify?code=${verificationCode}&email=${encodeURIComponent(toEmail)}`
    }

    console.log('Sending verification email with data:', {
      to: toEmail,
      name: userName,
      code: verificationCode,
      serviceId,
      templateId
    })

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    )

    if (response.status === 200) {
      console.log('Email sent successfully with code:', verificationCode)
      return { success: true, code: verificationCode }
    } else {
      console.error('EmailJS returned non-200 status:', response.status)
      return { success: false, error: `Email service returned status ${response.status}` }
    }
  } catch (error) {
    console.error('Error sending verification email:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export const testEmailService = async (testEmail: string): Promise<EmailResponse> => {
  if (!testEmail || !testEmail.includes('@')) {
    return { success: false, error: 'Invalid email address' }
  }

  try {
    // Generate a test code
    const testCode = generateVerificationCode()
    console.log('Testing email service with code:', testCode)

    const result = await sendVerificationEmail(testEmail, 'Test User', testCode)
    console.log('Test email service result:', result)
    return result
  } catch (error) {
    console.error('Test email error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 
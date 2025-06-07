import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return new NextResponse("Email is required", { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    if (user.isVerified) {
      return new NextResponse("User is already verified", { status: 400 })
    }

    // Generate new verification token
    const verificationToken = crypto.randomUUID()

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    })

    // Send verification email
    await resend.emails.send({
      from: "Inkly <noreply@inkly.app>",
      to: email,
      subject: "Verify your Inkly account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Inkly!</h1>
          <p>Hi ${user.name},</p>
          <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${verificationToken}" 
               style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If you didn't create an account with Inkly, you can safely ignore this email.</p>
          <p>Best regards,<br>The Inkly Team</p>
        </div>
      `,
    })

    return NextResponse.json({ message: "Verification email sent" })
  } catch (error) {
    console.error("[RESEND_VERIFICATION_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
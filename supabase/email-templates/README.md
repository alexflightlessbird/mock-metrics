# Supabase email templates

These HTML templates use Supabase's `{{ .Token }}` variable rather than a confirmation or recovery URL, so users can enter the code directly in MockMetrics.

In the Supabase Dashboard:

1. Open **Authentication → Email Templates**.
2. Set **Confirm signup** to the contents of [`confirm-signup.html`](./confirm-signup.html).
3. Set **Reset Password** to the contents of [`reset-password.html`](./reset-password.html).
4. In the email/provider settings, set the email OTP length to **6** and keep email confirmations enabled.

The signup flow verifies the code with the `signup` OTP type. The password-reset flow verifies it with the `recovery` OTP type, then lets the user set a new password.

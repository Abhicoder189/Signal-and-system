# Email Confirmation Setup Guide

Your app now has full email confirmation support. Here's what was fixed and how to configure it:

## What Changed

1. **AuthContext** now tracks `emailConfirmed` status
2. **AuthPage** displays confirmation pending UI after signup
3. **Resend email** button allows users to resend the confirmation email
4. **Refresh button** lets users check if they've confirmed their email
5. **Auto-detection** - When users click the link in the email, Supabase automatically confirms them

## Supabase Configuration

Email confirmation requires setup in your Supabase project:

### Step 1: Enable Email Confirmation

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **irfwutnvcbywjysjhszk**
3. Click **Authentication** → **Providers**
4. Scroll to **Email**
5. Check **Enable Email Confirmation** (or keep it at project default if already enabled)
6. Set **Email Confirmation Window** to 24 hours (default is fine)

### Step 2: Configure Email Sending

Supabase needs to send confirmation emails. Choose ONE option:

#### Option A: Use Supabase's Built-in SMTP (Easiest)

1. In Supabase Dashboard, go **Authentication** → **Email Templates**
2. Check that templates exist for:
   - `Confirm signup`
   - `Magic Link` (optional)
   - `Change Email` (optional)
   - `Reset Password` (optional)
3. The built-in SMTP is configured by default (hosted by Supabase)

#### Option B: Use Custom SMTP (Gmail, SendGrid, etc.)

1. Go **Authentication** → **SMTP Settings**
2. Enter your SMTP details:
   - **Host**: smtp.gmail.com (for Gmail)
   - **Port**: 587
   - **Username**: your-email@gmail.com
   - **Password**: App password (not your regular password)
   - **Sender Email**: noreply@yourdomain.com
3. Save settings

#### Option C: Use Sendgrid (Recommended for Production)

1. Create a [SendGrid account](https://sendgrid.com)
2. Generate an API key in SendGrid
3. Go to Supabase **Authentication** → **Email Templates**
4. In **SMTP Settings**, enter:
   - **Host**: smtp.sendgrid.net
   - **Port**: 587
   - **Username**: apikey
   - **Password**: your-sendgrid-api-key

### Step 3: Test Email Confirmation

1. Go to your app at `http://localhost:5173/auth` (or your deployed URL)
2. Click "Create account"
3. Enter an email and password (min 8 characters)
4. You should see: **"Account created! A confirmation link has been sent to your-email@..."**
5. Check your email for the confirmation link
6. Click the link in the email
7. You'll be redirected back to the app and automatically confirmed
8. You can now sign in and access premium features

### Step 4: Verify Database Schema

The database schema is ready, but if you haven't run the migration yet:

1. In your project directory: `supabase migration list`
2. Run: `supabase db push`
3. This creates the `user_subscriptions` table with email confirmation support

## How Email Confirmation Works

```
User signs up
    ↓
Email stored in Supabase (email_confirmed_at = null)
    ↓
Confirmation email sent
    ↓
User clicks link → redirected to app with token
    ↓
App detects token (detectSessionInUrl: true)
    ↓
Supabase confirms email (email_confirmed_at = now)
    ↓
User sees "Confirm your email" page with refresh button
    ↓
User clicks "Already confirmed? Refresh" or page auto-detects
    ↓
User can now sign in and use the app
```

## Troubleshooting

### Email not arriving

1. **Check Spam folder** - Add Supabase to your email provider's trusted senders
2. **Wrong SMTP config** - Test in Supabase **Email Templates** → "Send test email"
3. **Domain reputation** - If using Gmail SMTP, you may hit rate limits. Use SendGrid instead
4. **Email domain** - Custom domains need SPF/DKIM records. Supabase-hosted emails (from `mail.app.supabase.io`) have DNS configured

### Confirmation link not working

1. **Expired link** - After 24 hours, links expire. User must resend
2. **Wrong redirect** - Check that `REDIRECT_URL` in Supabase matches your app's base URL
3. **Incognito mode** - Try regular window if using incognito
4. **Different browser** - Token is tied to session; must use same browser

### User stuck on confirmation page

1. Click **"Resend confirmation email"** button
2. Click **"Already confirmed? Refresh"** button  
3. Check Supabase **Authentication** → **Users** to see if `email_confirmed_at` is set
4. If still stuck, user can sign out and try signing in again

## Disabling Email Confirmation

If you want to allow instant signups without confirmation:

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Uncheck **Enable Email Confirmation**
3. Users will be instantly signed in after signup

⚠️ **Warning**: Disabling email confirmation means:
- Users can sign up with invalid emails
- Spam bots can create accounts
- For production, keep email confirmation enabled

## Frontend Implementation Details

The app now includes:

- **isEmailConfirmed()** helper in AuthContext checks `email_confirmed_at`
- **resendConfirmationEmail()** function in AuthContext sends new confirmation email
- **emailConfirmed** state exported from useAuth() hook
- **ConfirmationPending** UI shows after signup
- **Auto-detection** via `detectSessionInUrl: true` in supabaseClient.js

Users exported from AuthContext:
```javascript
const { emailConfirmed, resendConfirmationEmail } = useAuth();
```

## Deployment

### For Vercel + Supabase

No additional setup needed. Email confirmation works automatically because:
1. Supabase sends from their mail server (no config needed)
2. Confirmation links redirect to your live domain
3. The app detects the token and confirms the email

Just make sure your `VITE_SUPABASE_URL` env variable is set correctly in Vercel.

---

**Questions?** Check [Supabase Auth Docs](https://supabase.com/docs/guides/auth/overview) or [Email Configuration Guide](https://supabase.com/docs/guides/auth/auth-email)

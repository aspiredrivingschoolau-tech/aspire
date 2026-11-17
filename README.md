This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Booking request emails

The booking form sends an HTML request notification to the school through `/api/booking-request` using Gmail SMTP. If the learner provides an email address, it also sends them an HTML confirmation.

For local development, copy `.env.example` to `.env.local` and replace the example values:

- `GMAIL_USER`: the Gmail account used to send messages.
- `GMAIL_APP_PASSWORD`: an App Password generated for that account (requires 2-Step Verification; do not use the normal Gmail password).
- `BOOKING_RECIPIENT_EMAIL`: the inbox that should receive booking requests.

For deployed email delivery, add these same three variables to the hosting provider's server-side environment-variable settings, then redeploy the app. A local `.env.local` file is not deployed with the app. Keep real credentials out of source control and do not share them in chat.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

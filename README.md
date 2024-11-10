# Next Sendbird Chat App

This is a [Next.js](https://nextjs.org/docs) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), that uses the [Sendbird](https://sendbird.com/) [API](https://sendbird.com/docs/chat/platform-api/v3/overview) and [JS SDK](https://sendbird.com/docs/chat/sdk/v4/javascript/overview)

## Prerequisite

First, [install Git](https://git-scm.com/)
Then, [install NodeJS](https://nodejs.org/fr)(it comes with npm).
Finally, execute the following command :
```sh
npm install
```

## Getting Started

Before anything, you will have to [create a Sendbird account](https://dashboard.sendbird.com/auth/signup), then signin, create an application, and copy the "Application ID" value and paste it as `APP_ID=[YOUR_KEY]` in a `.env` file at the root of this project.
You will also need the [API token](https://dashboard.sendbird.com/settings/apikey) as `API_TOKEN=[YOUR_API_TOKEN]`.

You can now run the development server:

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

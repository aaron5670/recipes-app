# 🍔 Recipes app

Mobile Recipes app using React Native (Expo) and Supabase.

## Adding or updating .env variables

When adding or updating .env variables, you need to run `eas env:push` to update the environment variables on the EAS
build servers.

## Run the app on a local device (emulator)

1. Clone the repository
2. Install dependencies: `bun install`
3. Prebuild the app: `npx expo prebuild`
4. To start the app on an emulator (make sure you have an emulator running):
    - iOS: `npx expo run:ios`
    - Android: `npx expo run:android`

## Generate types based on Supabase schema
1. Run `bun generate:types` to generate types based on the Supabase database schema.

## Run Supabase functions locally
1. Install Deno: `brew install deno`
2. Run Docker locally
3. Run `bun supabase:dev` to start the Supabase functions locally

## Deploy Supabase functions
1. Run `bun supabase:deploy` to deploy the Supabase functions to the Supabase instance

## Run the app on a physical device (EAS build)

1. Clone the repository
2. Install dependencies: `bun install`
3. Create EAS production build: `bun build:production` (configured for Android)

## Create a local build (APK)

1. Clone the repository
2. Install dependencies: `bun install`
3. Prebuild the app: `npx expo prebuild`
4. Create a local build: `bun build:local` (configured for Android)

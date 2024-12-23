# 🍔 Recipes app

Mobile Recipes app using React Native (Expo), Supabase and OpenAI.

## Features

- [x] User authentication
  - Sign up
  - Sign in
  - Sign out
- [x] Recipes on the home screen
- [x] Recipe details
- [x] Generate recipe based on uploaded food image
- [x] Store recipes in Supabase database and storage
- [x] Generate recipe based uploaded recipe image
- [ ] Generate recipe based on text input
- [ ] Edit generated recipe
- [ ] Share recipe
- [ ] Like recipe
- [ ] Comment on recipe
- [ ] Search for recipes

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

## Screenshots

<img src="https://github.com/user-attachments/assets/eb1db769-2307-4218-99c1-49fe7cbddba2" width="300"/>
<img src="https://github.com/user-attachments/assets/047d3ea1-2200-429a-831a-3c3514538104" width="300"/>
<img src="https://github.com/user-attachments/assets/4771c891-8ca4-4c5c-b60c-7dbef74847a2" width="293"/>
<img src="https://github.com/user-attachments/assets/50f57b37-237e-438d-b99d-bc4858cd2ca6" width="293"/>

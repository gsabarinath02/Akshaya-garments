---
description: How to deploy the Akshaya Garments app to Railway.app
---

# Deploying to Railway

This guide walks you through deploying your Next.js application with PostgreSQL to Railway.

## Prerequisites
- A GitHub account (you already have this and the code is pushed).
- A [Railway](https://railway.app/) account.

## Step 1: Create a New Project on Railway
1.  Log in to Railway.
2.  Click **"New Project"**.
3.  Select **"Deploy from GitHub repo"**.
4.  Select your repository: `gsabarinath02/Akshaya-garments`.
5.  Click **"Deploy Now"**.

## Step 2: Add a Database
1.  Once the project is created, you will see your application service.
2.  Click **"New"** (or Right Click on the canvas) -> **Database** -> **Add PostgreSQL**.
3.  Wait for the PostgreSQL service to initialize.

## Step 3: Configure Environment Variables
1.  Click on your **Application Service** (Akshaya-garments) card.
2.  Go to the **"Variables"** tab.
3.  Add the following variables:

    | Variable | Value |
    | :--- | :--- |
    | `DATABASE_URL` | Click "Reference Variable" -> Select `PostgreSQL` -> `DATABASE_URL`. |
    | `NEXTAUTH_SECRET` | Generate a random string (e.g., using `openssl rand -base64 32`) or type a long secure password. |
    | `NEXTAUTH_URL` | `https://<your-railway-domain>.boundary.railway.app` (You will get this domain after generating a domain in the settings tab, see Step 4). |
    | `CLOUDINARY_CLOUD_NAME` | Copy from your local `.env` |
    | `CLOUDINARY_API_KEY` | Copy from your local `.env` |
    | `CLOUDINARY_API_SECRET` | Copy from your local `.env` |

## Step 4: Generate a Domain
1.  In your Application Service, go to the **"Settings"** tab.
2.  Under **"Networking"**, click **"Generate Domain"**.
3.  Copy this domain (e.g., `akshaya-garments-production.up.railway.app`) and update the `NEXTAUTH_URL` variable in the **Variables** tab with `https://` prepended.

## Step 5: Redeploy
1.  Railway usually redeploys automatically when variables change.
2.  If not, click **"Deployments"** -> **"Redeploy"**.
3.  Wait for the build to finish.

## Step 6: Database Seeding (Optional but Recommended)
To get your initial categories and admin user:
1.  Click on your **PostgreSQL Service**.
2.  Go to the **"Data"** tab (or connect via a local client like PGAdmin using the credentials).
3.  Alternatively, use the Railway CLI or Build Command modifications to run seeds, but for now, the app should be live!

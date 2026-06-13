// Stripe client setup
// The publishable key is safe to expose on the client (unlike the secret key).
// Hardcoded here to match the existing BACKEND_URL convention in api/axiosInstance.ts.

import { loadStripe } from "@stripe/stripe-js"

const STRIPE_PUBLISHABLE_KEY =
    "pk_test_51TSi1q4nt3noOBR7WpGXCmvjgsaBaGnvaCOoZjcCc7S6cP1stg097JXOTiHdkNyDmrjeXaeVsvyHjm22IYQ4M3Ss00GNTRninn"

// loadStripe returns a promise; created once at module load and reused everywhere.
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

import Stripe from "stripe";
import { ENV } from "./env";

export const stripeObject = new Stripe(ENV.STRIPE_SECRET_KEY as string)
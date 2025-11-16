import Stripe from "stripe";
import { type NextRequest } from "next/server";
import db from "@/utils/db";

export const POST = async (req: NextRequest) => {
  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get("origin") ?? "";

  const { orderId, cartId } = await req.json();

  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  const cart = await db.cart.findUnique({
    where: { id: cartId },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order || !cart) {
    return Response.json(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const line_items = cart.cartItems.map((cartItem) => ({
    quantity: cartItem.amount,
    price_data: {
      currency: "gbp",
      product_data: {
        name: cartItem.product.name,
        images: [cartItem.product.image],
      },
      unit_amount: cartItem.product.price * 100,
    },
  }));

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  // Guard: if no key, don't try to use Stripe at all
  if (!stripeKey) {
    console.error("STRIPE_SECRET_KEY is not set, skipping Stripe payment logic");
    return Response.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey);

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { orderId, cartId }, // used later to update order & clear cart
      line_items,
      mode: "payment",
      return_url: `${origin}/api/confirm?session_id={CHECKOUT_SESSION_ID}`,
    });

    return Response.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error(error);
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
};

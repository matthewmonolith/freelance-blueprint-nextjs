import Stripe from "stripe";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import db from "@/utils/db";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return Response.json(
      { error: "Missing session_id" },
      { status: 400 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    console.error("STRIPE_SECRET_KEY is not set, skipping Stripe confirm logic");
    redirect("/orders");
  }

  const stripe = new Stripe(stripeKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const orderId = session.metadata?.orderId;
    const cartId = session.metadata?.cartId;

    if (session.status === "complete" && orderId) {
      await db.order.update({
        where: { id: orderId },
        data: { isPaid: true },
      });
    }

    if (cartId) {
      await db.cart.delete({
        where: { id: cartId },
      });
    }
  } catch (error) {
    console.error(error);
    return Response.json(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  redirect("/orders");
};

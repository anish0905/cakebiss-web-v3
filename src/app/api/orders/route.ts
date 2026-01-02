import dbConnect from "../../../lib/dbConnect";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Sirf ek baar session fetch karein authOptions ke saath
    const session: any = await getServerSession(authOptions);
    
    // Debugging ke liye: console.log("Session found:", session);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Login required to order" }, { status: 401 });
    }

    const { items, totalAmount, address, phone } = await request.json();

    const newOrder = await Order.create({
      user: session.user.id, 
      items,
      totalAmount,
      address,
      phone,
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  await dbConnect();
  const orders = await Order.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: orders });
}
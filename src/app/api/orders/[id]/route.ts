import dbConnect from "../../../../lib/dbConnect";
import Order from "../../../../models/Order";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Params ko Promise ki tarah handle karein
) {
  try {
    await dbConnect();
    
    // Modern Next.js mein params ko await karna padta hai
    const { id } = await params;
    const { status } = await request.json();

    console.log("Updating Order ID:", id, "to Status:", status);

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      console.log("Order not found in Database");
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    console.error("Patch Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
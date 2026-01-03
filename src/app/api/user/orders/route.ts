import dbConnect from "../../../../lib/dbConnect";
import Order from "../../../../models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const session: any = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: orders });
}
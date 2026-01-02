import dbConnect from "../../../../lib/dbConnect";
import Order from "../../../../models/Order";
import Cake from "../../../../models/Cake";
import Contact from "../../../../models/Contact";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Saara data ek saath fetch karein
    const [orders, cakeCount, messageCount] = await Promise.all([
      Order.find({}),
      Cake.countDocuments(),
      Contact.countDocuments(),
    ]);

    // Total Earning calculate karein
    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.status === "Pending").length;

    return NextResponse.json({
      success: true,
      stats: {
        totalSales,
        orderCount: orders.length,
        cakeCount,
        messageCount,
        pendingOrders
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
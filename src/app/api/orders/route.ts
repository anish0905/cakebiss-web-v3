import dbConnect from "../../../lib/dbConnect";
import Order from "../../../models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const session: any = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Login required to order" }, { status: 401 });
    }

    // Frontend se naye customization fields ko destruct karein
    const { 
      items, 
      totalAmount, 
      deliveryCharge, 
      address, 
      pincode, 
      phone,
      deliveryDate,  // Naya field
      occasion,      // Naya field
      cakeMessage    // Naya field
    } = await request.json();

    // Database mein naya order create karein
    const newOrder = await Order.create({
      user: session.user.id, 
      items,
      totalAmount,      
      deliveryCharge,   
      address,
      pincode,          
      phone,
      deliveryDate,     // Save to DB
      occasion,        // Save to DB
      cakeMessage,     // Save to DB
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    // Validation errors ko handle karne ke liye
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    // Admin ke liye orders fetch karein aur user details populate karein
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name email");
      
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
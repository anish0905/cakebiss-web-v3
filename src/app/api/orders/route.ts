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

    const body = await request.json();
    const { 
      items, // Ye cart items ka array hai
      totalAmount, 
      deliveryCharge, 
      address, 
      pincode, 
      phone,
      deliveryDate,
      occasion,
      cakeMessage,
      instructions // Extra field agar user ne koi note likha ho
    } = body;

    // 1. Items ko map karein taaki Weight aur Unit sahi se save ho
    const orderItems = items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.discountPrice > 0 ? item.discountPrice : item.price,
      image: item.image,
      weight: item.weight, // <--- Cart se weight database mein save hoga
      unit: item.unit      // <--- Cart se unit database mein save hoga
    }));

    // 2. Database mein naya order create karein
    const newOrder = await Order.create({
      user: session.user.id, 
      items: orderItems, // Mapped items use karein
      totalAmount,      
      deliveryCharge,   
      address,
      pincode,          
      phone,
      deliveryDate,     
      occasion,        
      cakeMessage,     
      instructions      
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// GET method (Admin ke liye) same rahega...
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
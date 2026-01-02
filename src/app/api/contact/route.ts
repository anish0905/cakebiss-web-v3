import dbConnect from "../../../lib/dbConnect";
import Contact from "../../../models/Contact";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const enquiry = await Contact.create(body);
    return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Admin ke liye enquiries fetch karne ke liye
export async function GET() {
  try {
    await dbConnect();
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
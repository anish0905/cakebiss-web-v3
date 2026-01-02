import dbConnect from "../../../lib/dbConnect";
import Cake from "../../../models/Cake";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const cake = await Cake.create(body);
    return NextResponse.json({ success: true, data: cake }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const cakes = await Cake.find({});
    return NextResponse.json({ success: true, data: cakes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
import dbConnect from "../../../../lib/dbConnect";
import Cake from "../../../../models/Cake";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await Cake.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Cake deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
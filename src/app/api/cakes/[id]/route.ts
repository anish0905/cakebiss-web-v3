import dbConnect from "../../../../lib/dbConnect";
import Cake from "../../../../models/Cake";
import { NextResponse } from "next/server";

// Next.js 15 mein context (params) ko Promise define karna padta hai
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await dbConnect();

    // Params ko access karne se pehle await karein
    const { id } = await params;

    const deletedCake = await Cake.findByIdAndDelete(id);

    if (!deletedCake) {
      return NextResponse.json(
        { success: false, message: "Cake not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Cake deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// Agar aapne isi file mein GET ya PATCH likha hai, toh unhe bhi aise hi update karein:
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    const updatedCake = await Cake.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updatedCake });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
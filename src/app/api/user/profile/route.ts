import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Get Profile & Orders
export async function GET() {
  await dbConnect();
  const session: any = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await User.findById(session.user.id).select("-password");
  return NextResponse.json({ success: true, data: user });
}

// Update Profile Address
export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const session: any = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    
    // Update Logic: Hum body se data nikal kar specific fields update karenge
    const updateData: any = {};
    if (body.addresses) updateData.addresses = body.addresses;
    if (body.availablePhone) updateData.availablePhone = body.availablePhone;

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
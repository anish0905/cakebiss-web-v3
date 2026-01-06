import dbConnect from "../../../../lib/dbConnect";
import Cake from "../../../../models/Cake";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    
    let updatedData = { ...body };

    // 1. Handle Main Image Update
    if (body.image && body.image.startsWith("data:image")) {
      const mainRes = await cloudinary.uploader.upload(body.image, {
        folder: "cake_products/main",
      });
      updatedData.image = mainRes.secure_url;
    }

    // 2. Handle Extra Images Update
    // Hum check karenge ki kya 'extraImagesBase64' array bheja gaya hai
    if (body.extraImagesBase64 && Array.isArray(body.extraImagesBase64)) {
      const newExtraUrls = [];
      
      for (const img of body.extraImagesBase64) {
        // Agar image Base64 hai toh naya upload karein, varna purana URL rakhein
        if (img && img.startsWith("data:image")) {
          const extraRes = await cloudinary.uploader.upload(img, {
            folder: "cake_products/extras",
          });
          newExtraUrls.push(extraRes.secure_url);
        } else if (img) {
          newExtraUrls.push(img); // Purana URL maintain karein
        }
      }
      updatedData.extraImages = newExtraUrls;
    }

    const cake = await Cake.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!cake) {
      return NextResponse.json({ success: false, error: "Cake not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: cake });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const cake = await Cake.findByIdAndDelete(id);
    
    if (!cake) {
      return NextResponse.json({ success: false, error: "Cake not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Cake Deleted Successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const cake = await Cake.findById(id);
    
    if (!cake) {
      return NextResponse.json({ success: false, error: "Cake not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: cake });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
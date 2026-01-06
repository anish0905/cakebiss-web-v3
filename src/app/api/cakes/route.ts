import dbConnect from "../../../lib/dbConnect";
import Cake from "../../../models/Cake";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // 1. Main Image Upload
    const mainUpload = await cloudinary.uploader.upload(body.image, {
      folder: "cake_products/main",
    });

    // 2. Extra Images Upload (Looping through the array)
    // Maan lijiye frontend se 'extraImagesBase64' naam ka array aa raha hai
    let extraImagesUrls = [];
    if (body.extraImagesBase64 && Array.isArray(body.extraImagesBase64)) {
      for (const base64Img of body.extraImagesBase64) {
        if (base64Img) {
          const res = await cloudinary.uploader.upload(base64Img, {
            folder: "cake_products/extras",
          });
          extraImagesUrls.push(res.secure_url);
        }
      }
    }

    // 3. New Data Object taiyar karein
    const newCakeData = {
      ...body,
      image: mainUpload.secure_url,       // Main Image URL
      extraImages: extraImagesUrls,      // Array of 3 Extra Image URLs
    };

    // 4. MongoDB mein Save karein
    const cake = await Cake.create(newCakeData);

    return NextResponse.json({ success: true, data: cake }, { status: 201 });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const cakes = await Cake.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: cakes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
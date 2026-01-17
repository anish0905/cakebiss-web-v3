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

    const { 
      image, 
      extraImagesBase64, 
      name, 
      description, 
      highlights, 
      priceVariants, 
      category, 
      flavor, 
      isEggless, 
      quantity,
      unit 
    } = body;

    // 1. Main Image Upload to Cloudinary
    const mainUpload = await cloudinary.uploader.upload(image, {
      folder: "cake_products/main",
    });

    // 2. Extra Images Upload
    let extraImagesUrls = [];
    if (extraImagesBase64 && Array.isArray(extraImagesBase64)) {
      for (const base64Img of extraImagesBase64) {
        if (base64Img) {
          const res = await cloudinary.uploader.upload(base64Img, {
            folder: "cake_products/extras",
          });
          extraImagesUrls.push(res.secure_url);
        }
      }
    }

    // 3. New Data Object (Mapping all new logic)
    const newCakeData = {
      name,
      description,
      highlights,      // Array of strings
      priceVariants,   // Array of objects {weight, price, discountPrice}
      category,
      flavor,
      isEggless,
      quantity,
      unit,
      image: mainUpload.secure_url,
      extraImages: extraImagesUrls,
    };

    // 4. Create in MongoDB
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
    // Latest cakes pehle dikhane ke liye sort
    const cakes = await Cake.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: cakes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User (Pehle user ko aap manually DB mein admin bana dena)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user" // Default role
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fname, lname, email, phone, service, message } = data;

    // Validate required fields
    if (!fname || !lname || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address format." },
        { status: 400 }
      );
    }

    // Node Server side logging
    console.log("Contact form submission received:", {
      fname,
      lname,
      email,
      phone,
      service,
      message,
    });

    // Match contact.php's successful mock fallback response for testing
    return NextResponse.json({
      success: true,
      message: "Mock submission successful (API route fallback).",
    });
  } catch (error) {
    console.error("API contact error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const {
      name,
      mobile,
      email,
      url,
      examType,
      results,
    } = await req.json();

    // basic validation
    if (
      !name ||
      !mobile ||
      !email ||
      !url ||
      !examType ||
      !results
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if record already exists
    const { data: existingData, error: checkError } = await supabase
      .from("calculator_submissions")
      .select("id")
      .eq("name", name)
      .eq("mobile", mobile)
      .eq("email", email)
      .eq("url", url)
      .eq("exam_type", examType)
      .limit(1);

    if (checkError) {
      console.error("Check existing error:", checkError);
      // Continue with insert if check fails
    } else if (existingData && existingData.length > 0) {
      // Record already exists, return success without inserting
      return NextResponse.json({
        success: true,
        message: "Data already exists",
      });
    }

    // Insert new record
    const { data, error } = await supabase
      .from("calculator_submissions")
      .insert({
        name,
        mobile,
        email,
        url,
        exam_type: examType,
        results,
      });

    if (error) {
      return NextResponse.json(
        {
          error: "Failed to save data",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Save API error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

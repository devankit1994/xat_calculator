import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, mobile, email, url, examType, results, tableName, city } =
      await req.json();

    // Decide table based on caller input (whitelisted for safety)
    const allowedTables = new Set(["cmat_scores", "xat_scores"]);
    const inferredTable =
      examType === "CMAT"
        ? "cmat_scores"
        : examType === "XAT"
          ? "xat_scores"
          : null;

    const targetTable: string | null = tableName ?? inferredTable;

    // basic validation
    if (!name || !mobile || !email || !url || !examType || !results) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!targetTable || !allowedTables.has(targetTable)) {
      return NextResponse.json(
        {
          error: "Invalid or missing tableName",
          allowed: Array.from(allowedTables),
        },
        { status: 400 },
      );
    }

    // Check if record already exists
    const { data: existingData, error: checkError } = await supabase
      .from(targetTable)
      .select("id")
      .eq("name", name)
      .eq("mobile", mobile)
      .eq("email", email)
      .eq("url", url)
      // .eq("exam_type", examType)
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
    const { data, error } = await supabase.from(targetTable).insert({
      name,
      mobile,
      email,
      url,
      city,
      // exam_type: examType,
      // results,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: "Failed to save data",
          details: error.message,
        },
        { status: 500 },
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
      { status: 500 },
    );
  }
}

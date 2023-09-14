import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Autsada Wiriya",
    studentId: "650612107",
  });
};

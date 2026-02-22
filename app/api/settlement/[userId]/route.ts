import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> },
) {
    try {
        const { userId } = await params;
        const res = await fetch(`${BACKEND_URL}/api/settlement/${userId}`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ detail: "Service unavailable" }, { status: 503 });
    }
}

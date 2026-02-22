import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const res = await fetch(`${BACKEND_URL}/api/service-request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ detail: "Service unavailable" }, { status: 503 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get("userId");
        if (!userId) {
            return NextResponse.json({ detail: "userId query param required" }, { status: 400 });
        }
        const res = await fetch(`${BACKEND_URL}/api/service-request/${userId}`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ detail: "Service unavailable" }, { status: 503 });
    }
}

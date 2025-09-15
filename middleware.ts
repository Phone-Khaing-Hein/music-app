import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    
    // For now, just pass through all requests
    // You can add auth logic here if needed
    return res;
}
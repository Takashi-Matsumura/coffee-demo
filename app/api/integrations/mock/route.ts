import type { NextRequest } from "next/server";
import { getIntegration } from "@/lib/integrations";
import type { IntegrationKey } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    key?: IntegrationKey;
  };
  if (!body.key) {
    return Response.json({ error: "key is required" }, { status: 400 });
  }
  const integration = getIntegration(body.key);
  return Response.json({
    ok: true,
    message: `${integration.label} に送信しました（モック）`,
    integration: integration.key,
    sentAt: new Date().toISOString(),
  });
}

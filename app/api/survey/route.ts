import { NextRequest, NextResponse } from "next/server";
import {
  addSurveyResponse,
  listSurveyResponses,
  SurveyResponseInput,
} from "@/lib/survey";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SurveyResponseInput;
  const response = addSurveyResponse({ answers: body.answers ?? {} });
  return NextResponse.json({ ok: true, response });
}

export async function GET() {
  const responses = listSurveyResponses();
  return NextResponse.json({ ok: true, count: responses.length, responses });
}

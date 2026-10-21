import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { PDFParse } from "pdf-parse";
import { CATEGORY_CONFIG, type CategoryKey } from "@/lib/document-categories";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  // TODO: reuse the same admin auth check as documents/route.ts

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file || file.type !== "application/pdf") {
    return NextResponse.json({ error: "PDF required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText({ first: 2 });
  await parser.destroy();
  const excerpt = text.slice(0, 4000);

  const categoryKeys = Object.keys(CATEGORY_CONFIG) as CategoryKey[];
  const categoryDescriptions = categoryKeys
    .map(k => `${k} (${CATEGORY_CONFIG[k].labelFr})`)
    .join(", ");

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: `You classify bank documents and generate titles. Reply ONLY with JSON: {"title_fr":"","title_en":"","title_ar":"","category":""}. "category" must be exactly one of these keys: ${categoryDescriptions}. Titles must be concise (max 10 words), professional, and properly translated (not literal) for each language.`,
      },
      { role: "user", content: `Document filename: ${file.name}\n\nExcerpt:\n${excerpt}` },
    ],
    temperature: 0.2,
  });

  let result: { title_fr: string; title_en: string; title_ar: string; category: string };
  try {
    result = JSON.parse(completion.choices[0].message.content!);
  } catch {
    return NextResponse.json({ error: "AI parse failed" }, { status: 502 });
  }

  if (!categoryKeys.includes(result.category as CategoryKey)) {
    return NextResponse.json({ error: "Invalid category from AI" }, { status: 502 });
  }

  return NextResponse.json(result);
}
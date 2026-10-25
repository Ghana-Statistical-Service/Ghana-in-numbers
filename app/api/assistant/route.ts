import OpenAI from "openai";
import { answerDashboardQuestion, type AssistantMessage } from "@/lib/assistant/service";
import { reserveAssistantRequest } from "@/lib/assistant/limits";

export const runtime = "nodejs";
export const maxDuration = 90;
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers });

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY || process.env.AI_ASSISTANT_ENABLED === "false") return reply({ error: "The data assistant is not configured yet. Please try again later." }, 503);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reply({ error: "This request must come from the dashboard." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply({ error: "Send a JSON question." }, 415);
  let raw = "";
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "A question is required." }, 400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 16000) { await reader.cancel(); return reply({ error: "This conversation is too long. Start a new conversation." }, 413); }
      chunks.push(chunk.value);
    }
    raw = new TextDecoder().decode(Buffer.concat(chunks));
  } catch { return reply({ error: "Could not read the question." }, 400); }
  let messages: AssistantMessage[];
  try {
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object" || !("messages" in body) || !Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 9) throw new Error();
    messages = body.messages.map((message: unknown) => {
      if (!message || typeof message !== "object" || !("role" in message) || !("content" in message) || !["user", "assistant"].includes(String(message.role)) || typeof message.content !== "string" || message.content.trim().length < 1 || message.content.length > 2000) throw new Error();
      return { role: message.role as AssistantMessage["role"], content: message.content.trim() };
    });
    if (messages.at(-1)?.role !== "user") throw new Error();
  } catch { return reply({ error: "Ask a question of up to 2,000 characters." }, 400); }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const release = reserveAssistantRequest(ip);
  if (!release) return reply({ error: "The assistant’s request limit has been reached. Please wait a minute or try again later." }, 429);
  try {
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(80000)]);
    return reply(await answerDashboardQuestion(messages, signal));
  } catch (error) {
    // Do not log provider messages, prompts, raw request bodies or credentials.
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401 || error.status === 403) return reply({ error: "The AI service could not authenticate. The dashboard administrator needs to check the API configuration." }, 503);
      if (error.status === 429) return reply({ error: "The AI provider’s usage or billing limit was reached. Please try again later." }, 429);
      return reply({ error: "The AI service is temporarily unavailable. Please try again shortly." }, 502);
    }
    return reply({ error: "I could not complete this answer. Please try a shorter question with an indicator and year." }, 502);
  } finally { release(); }
}

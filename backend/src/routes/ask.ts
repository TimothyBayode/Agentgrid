import { Router } from "express";
import { serverEnv } from "../config/env.js";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase.js";
import { requireAuth } from "../middleware/require-auth.js";

export const askRouter = Router();

askRouter.post("/ask", requireAuth, async (request, response) => {
  const claims = request.privyClaims;
  if (!claims) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  const { question, conversationId, previousMessages } = request.body as {
    question: string;
    conversationId?: string;
    previousMessages?: Array<{ role: string; content: string; timestamp: number }>;
  };

  if (!question?.trim()) {
    response.status(400).json({ error: "Question is required" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    response.status(503).json({ error: "AI service is not configured" });
    return;
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: buildPrompt(question, previousMessages) }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const text = await geminiResponse.text();
      response.status(502).json({ error: "AI service error", detail: text });
      return;
    }

    const data = (await geminiResponse.json()) as {
      candidates?: Array<{
        content: { parts: Array<{ text: string }> };
      }>;
    };

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      const convoId = conversationId ?? generateConversationId(claims.userId);
      await supabase.from("ask_conversations").upsert(
        {
          id: convoId,
          privy_user_id: claims.userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
      await supabase.from("ask_messages").insert([
        {
          conversation_id: convoId,
          role: "user",
          content: question,
        },
        {
          conversation_id: convoId,
          role: "grid",
          content: answer,
        },
      ]);
      response.json({ answer, conversationId: convoId });
    } else {
      response.json({ answer, conversationId: null });
    }
  } catch (error) {
    response.status(500).json({
      error: "Ask Grid request failed",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
});

function buildPrompt(
  question: string,
  previousMessages?: Array<{ role: string; content: string }>,
): string {
  const lines: string[] = [
    "You are Grid, the AgentGrid assistant. You help users discover, compare, and hire autonomous AI agents on BNB Chain.",
    "Always answer concisely. If the user is looking for agents, recommend specific agent categories or capabilities.",
    "If the user wants to compare agents, list 2-3 options with reputation, price, and protocol.",
    "If the user wants to hire, guide them toward the /agents catalog or /ask-grid hire flow.",
    "",
    `User question: ${question}`,
  ];

  if (previousMessages?.length) {
    lines.push("", "Recent conversation context:");
    for (const msg of previousMessages.slice(-6)) {
      lines.push(`- ${msg.role}: ${msg.content}`);
    }
  }

  return lines.join("\n");
}

function generateConversationId(userId: string): string {
  return `conv-${userId}-${Date.now()}`;
}

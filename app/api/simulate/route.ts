import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { decision } = await req.json();

  if (!decision?.trim()) {
    return Response.json({ error: "Decision is required" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a simulation engine. Given a life decision, simulate two parallel universe timelines.

Decision: "${decision}"

Universe A: the user TAKES this decision.
Universe B: the user does NOT take this decision.

Rules:
- Write exactly 5 entries per universe, for years 2026, 2027, 2028, 2029, 2030.
- Each story entry should be 2-3 vivid, narrative sentences.
- Make Universe A and Universe B feel meaningfully different.
- Provide a single regretLevel (0–100%) reflecting how much regret the user might feel for NOT taking the decision.
- Provide a single happinessIndex (0–100%) reflecting projected long-term happiness if the decision IS taken.
- Return ONLY raw JSON with no markdown fences, no explanation, no extra text.

Required JSON shape:
{
  "universeA": [
    {"year": "2026", "story": "..."},
    {"year": "2027", "story": "..."},
    {"year": "2028", "story": "..."},
    {"year": "2029", "story": "..."},
    {"year": "2030", "story": "..."}
  ],
  "universeB": [
    {"year": "2026", "story": "..."},
    {"year": "2027", "story": "..."},
    {"year": "2028", "story": "..."},
    {"year": "2029", "story": "..."},
    {"year": "2030", "story": "..."}
  ],
  "regretLevel": "42%",
  "happinessIndex": "78%"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON even if model wraps it in markdown fences
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      throw new Error("No JSON object found in model output");
    }

    const parsed = JSON.parse(text.slice(start, end + 1));
    return Response.json(parsed);
  } catch (err) {
    console.error("Gemini/parse error:", err);
    return Response.json(
      { error: "Failed to generate simulation. Try again." },
      { status: 502 }
    );
  }
}

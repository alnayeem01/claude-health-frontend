import type { HealthMetrics, InsightData, LifestyleInputs } from "@/components/futureself/types";

export type HealthSimulateResponse = {
  id: number;
  createdAt: string;
  inputs: LifestyleInputs;
  metrics: HealthMetrics;
  insight: InsightData;
};

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return base.replace(/\/$/, "");
}

export async function postHealthSimulate(
  inputs: LifestyleInputs
): Promise<HealthSimulateResponse> {
  const r = await fetch(`${apiBase()}/api/health/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputs),
  });

  const text = await r.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* ignore */
  }

  if (!r.ok) {
    const errMsg =
      body &&
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof (body as { error: unknown }).error === "string"
        ? (body as { error: string }).error
        : `Request failed (${r.status})`;
    const err = new Error(errMsg) as Error & { status?: number };
    err.status = r.status;
    throw err;
  }

  const j = body as HealthSimulateResponse;
  if (
    !j?.metrics ||
    !j?.insight ||
    typeof j.id !== "number" ||
    typeof j.createdAt !== "string"
  ) {
    throw new Error("Invalid response from server");
  }
  return j;
}

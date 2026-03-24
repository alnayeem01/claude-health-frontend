export type TimelineEntry = {
  year: string;
  story: string;
};

export type SimulateResponse = {
  universeA: TimelineEntry[];
  universeB: TimelineEntry[];
  regretLevel?: string;
  happinessIndex?: string;
};

export async function simulateDecision(decision: string): Promise<SimulateResponse> {
  const res = await fetch("/api/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ decision }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? "Request failed");
  }

  return res.json();
}

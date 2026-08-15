import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { enforceAgentReview, parseAgentResponse } from "./agentPolicy";

const context = {
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("agent input safety contract", () => {
  it("rejects empty messages before invoking the model", async () => {
    const caller = appRouter.createCaller(context);
    await expect(
      caller.agent.respond({ message: "   " })
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("rejects oversized messages and histories", async () => {
    const caller = appRouter.createCaller(context);
    await expect(
      caller.agent.respond({ message: "a".repeat(4001) })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(
      caller.agent.respond({
        message: "valid",
        history: Array.from({ length: 13 }, () => ({
          role: "user" as const,
          content: "context",
        })),
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("forces human review for sensitive requests even if the model says no", () => {
    expect(enforceAgentReview("Necesito consejo legal", "general", false)).toBe(
      true
    );
    expect(
      enforceAgentReview("Ordena mis ideas de marca", "branding", false)
    ).toBe(false);
    expect(
      enforceAgentReview("Cualquier consulta", "external-action", false)
    ).toBe(true);
  });

  it("keeps model-requested review enabled for non-sensitive categories", () => {
    expect(enforceAgentReview("Ayúdame a explorar", "branding", true)).toBe(
      true
    );
  });

  it("accepts the structured response contract and rejects invalid output", () => {
    expect(
      parseAgentResponse(
        JSON.stringify({
          category: "branding",
          answer: "Respuesta verificable",
          needsHumanReview: false,
        })
      )
    ).toEqual({
      category: "branding",
      answer: "Respuesta verificable",
      needsHumanReview: false,
    });
    expect(() => parseAgentResponse("not-json")).toThrow("Unexpected token");
    expect(() =>
      parseAgentResponse(
        JSON.stringify({
          category: "branding",
          answer: "",
          needsHumanReview: false,
        })
      )
    ).toThrow("invalid-agent-response");
  });
});

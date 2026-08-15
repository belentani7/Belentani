import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDb, invokeLLM } = vi.hoisted(() => ({
  getDb: vi.fn(),
  invokeLLM: vi.fn(),
}));

vi.mock("./db", () => ({ getDb }));
vi.mock("./_core/llm", () => ({ invokeLLM }));

import { ingestAuthorizedEmails } from "./emailIngestion";

describe("authorized email ingestion persistence contract", () => {
  const onDuplicateKeyUpdate = vi.fn().mockResolvedValue(undefined);
  const values = vi.fn().mockReturnValue({ onDuplicateKeyUpdate });
  const insert = vi.fn().mockReturnValue({ values });

  beforeEach(() => {
    vi.clearAllMocks();
    getDb.mockResolvedValue({ insert });
    invokeLLM.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              category: "support",
              draftBody: "Borrador pendiente de revisión humana.",
            }),
          },
        },
      ],
    });
  });

  it("uses externalMessageId upsert semantics and keeps the result in draft state", async () => {
    const message = {
      externalMessageId: "gmail-duplicate-1",
      fromAddress: "Client Example <client@example.com>",
      subject: "Consulta",
      originalBody: "Necesito información.",
      receivedAt: new Date("2026-08-15T09:00:00.000Z"),
    };

    await ingestAuthorizedEmails([message]);
    await ingestAuthorizedEmails([message]);

    expect(insert).toHaveBeenCalledTimes(2);
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        externalMessageId: "gmail-duplicate-1",
        status: "draft",
      })
    );
    expect(onDuplicateKeyUpdate).toHaveBeenCalledTimes(2);
  });

  it("does not persist when the classifier provider fails", async () => {
    invokeLLM.mockRejectedValueOnce(new Error("provider-unavailable"));

    await expect(
      ingestAuthorizedEmails([
        {
          externalMessageId: "gmail-provider-failure",
          fromAddress: "client@example.com",
          subject: "Consulta",
          originalBody: "Contenido.",
          receivedAt: new Date(),
        },
      ])
    ).rejects.toThrow("provider-unavailable");

    expect(insert).not.toHaveBeenCalled();
  });
});

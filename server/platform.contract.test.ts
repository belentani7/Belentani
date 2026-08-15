import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = {
  user: null,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
} as TrpcContext;

describe("platform contracts", () => {
  it("rejects an empty agent message before invoking the model", async () => {
    const caller = appRouter.createCaller(context);
    await expect(
      caller.agent.respond({ message: "   " })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects oversized catalog page sizes", async () => {
    const caller = appRouter.createCaller(context);
    await expect(
      caller.catalog.list({ query: "", page: 1, pageSize: 1000 })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("protects administrative CRUD mutations when unauthenticated", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.admin.catalogArchive({ id: 1 })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      caller.admin.mediaUpdate({ id: 1, title: "Media title" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.admin.templateArchive({ id: 1 })).rejects.toMatchObject(
      { code: "UNAUTHORIZED" }
    );
    await expect(
      caller.admin.changelogArchive({ id: 1 })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      caller.admin.automationCreate({
        name: "Job",
        description: "Descripción del job",
        cronExpression: "0 * * * *",
        callbackPath: "/api/scheduled/growth-report",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      caller.admin.automationUpdate({
        id: 1,
        name: "Job",
        description: "Descripción del job",
        cronExpression: "0 * * * *",
        callbackPath: "/api/scheduled/growth-report",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      caller.admin.automationArchive({ id: 1 })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

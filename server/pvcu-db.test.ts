import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock } = vi.hoisted(() => ({ getDbMock: vi.fn() }));
vi.mock("./db", () => ({ getDb: getDbMock }));

import {
  createPvcEvidence,
  createPvcException,
  createPvcValidation,
  listPvcEvidence,
  listPvcExceptions,
  listPvcValidations,
} from "./pvcu-db";

function createDbDouble() {
  let selectedRows: unknown[] = [];
  const insertedRows: unknown[] = [];

  const selectBuilder = () => {
    const builder = {
      from: () => builder,
      where: () => builder,
      orderBy: () => builder,
      limit: () => builder,
      then: (resolve: (value: unknown[]) => unknown, reject?: (reason: unknown) => unknown) =>
        Promise.resolve(selectedRows).then(resolve, reject),
    };
    return builder;
  };

  const db = {
    select: () => selectBuilder(),
    insert: () => ({
      values: async (input: unknown) => {
        insertedRows.push(input);
        selectedRows = [input];
      },
    }),
  };

  return {
    db,
    setRows: (rows: unknown[]) => {
      selectedRows = rows;
    },
    insertedRows,
  };
}

describe("PVC-U data access layer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates and then reads evidence within the requested tenant", async () => {
    const double = createDbDouble();
    getDbMock.mockResolvedValue(double.db);
    const input = {
      evidenceId: "evi-tenant-a-1",
      validationId: "val-tenant-a-1",
      tenantKey: "tenant-a",
      evidenceHash: "a".repeat(64),
      algorithm: "sha256",
      provenance: { source: "test" },
    };

    const created = await createPvcEvidence(input);
    expect(created).toEqual(input);
    expect(double.insertedRows).toEqual([input]);

    double.setRows([input]);
    await expect(listPvcEvidence("tenant-a", "val-tenant-a-1")).resolves.toEqual([input]);
  });

  it("keeps exception persistence scoped by tenant key", async () => {
    const double = createDbDouble();
    getDbMock.mockResolvedValue(double.db);
    const input = {
      exceptionId: "exc-tenant-a-1",
      tenantKey: "tenant-a",
      profileId: "profile-a",
      reason: "Approved maintenance window",
      compensatingControls: "Human approval and rollback",
      expiresAt: new Date(Date.now() + 60_000),
      approvedBy: "owner-a",
      status: "active" as const,
    };

    await expect(createPvcException(input)).resolves.toEqual(input);
    expect(double.insertedRows).toEqual([input]);
    double.setRows([input]);
    await expect(listPvcExceptions("tenant-a")).resolves.toEqual([input]);
  });

  it("keeps validation persistence scoped by tenant key", async () => {
    const double = createDbDouble();
    getDbMock.mockResolvedValue(double.db);
    const input = {
      validationId: "val-tenant-b-1",
      tenantKey: "tenant-b",
      profileId: "profile-b",
      artifactType: "request",
      riskClass: "low",
      status: "approved" as const,
      evidenceHash: "b".repeat(64),
    };

    await expect(createPvcValidation(input)).resolves.toEqual(input);
    expect(double.insertedRows).toEqual([input]);
    double.setRows([input]);
    await expect(listPvcValidations("tenant-b")).resolves.toEqual([input]);
  });
});

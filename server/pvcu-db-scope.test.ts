import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDbMock } = vi.hoisted(() => ({ getDbMock: vi.fn() }));

vi.mock("drizzle-orm", () => ({
  and: (...conditions: Array<Record<string, unknown>>) => ({ op: "and", conditions }),
  desc: (column: { name?: string }) => ({ op: "desc", field: column.name }),
  eq: (column: { name?: string }, value: unknown) => ({ op: "eq", field: column.name, value }),
}));
vi.mock("./db", () => ({ getDb: getDbMock }));

import { getPvcTenant, listPvcTenants } from "./pvcu-db";

const tenantRows = [
  { id: 1, tenantKey: "tenant-a", ownerOpenId: "owner-a" },
  { id: 2, tenantKey: "tenant-b", ownerOpenId: "owner-b" },
];

function matches(row: Record<string, unknown>, condition: Record<string, unknown>): boolean {
  if (condition.op === "eq") return row[condition.field as string] === condition.value;
  if (condition.op === "and") return (condition.conditions as Array<Record<string, unknown>>).every((item) => matches(row, item));
  return true;
}

function createScopeDbDouble() {
  const selectBuilder = () => {
    let rows = [...tenantRows];
    const builder = {
      from: () => builder,
      where: (condition: Record<string, unknown>) => {
        rows = rows.filter((row) => matches(row, condition));
        return builder;
      },
      orderBy: () => builder,
      limit: (count: number) => {
        rows = rows.slice(0, count);
        return builder;
      },
      then: (resolve: (value: typeof tenantRows) => unknown, reject?: (reason: unknown) => unknown) =>
        Promise.resolve(rows).then(resolve, reject),
    };
    return builder;
  };
  return { select: () => selectBuilder() };
}

describe("PVC-U data scope", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getDbMock.mockResolvedValue(createScopeDbDouble());
  });

  it("filters listPvcTenants by ownerOpenId for regular users", async () => {
    await expect(listPvcTenants("owner-a", false)).resolves.toEqual([tenantRows[0]]);
  });

  it("rejects cross-owner getPvcTenant while allowing the owner tenant", async () => {
    await expect(getPvcTenant("tenant-a", "owner-a", false)).resolves.toEqual(tenantRows[0]);
    await expect(getPvcTenant("tenant-b", "owner-a", false)).resolves.toEqual(undefined);
  });

  it("allows the explicit admin path to select another owner tenant", async () => {
    await expect(getPvcTenant("tenant-b", "owner-a", true)).resolves.toEqual(tenantRows[1]);
  });
});

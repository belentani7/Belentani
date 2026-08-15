import { desc, eq } from "drizzle-orm";
import { adminActionAudit } from "../drizzle/schema";
import { getDb } from "./db";

export async function recordAdminAction(input: {
  actorUserId: number;
  action: string;
  entityType: string;
  entityId?: number;
  outcome?: "success" | "failure";
}) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(adminActionAudit).values({
    actorUserId: input.actorUserId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    outcome: input.outcome ?? "success",
  });
  return true;
}

export async function listAdminActions(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(adminActionAudit)
    .orderBy(desc(adminActionAudit.occurredAt))
    .limit(limit);
}

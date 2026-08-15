import { createHash } from "node:crypto";
import { asc, desc, eq } from "drizzle-orm";
import { emailDraftAudit, emailDrafts } from "../drizzle/schema";
import { getDb } from "./db";

function hashDraftBody(value: string | undefined) {
  return value
    ? createHash("sha256").update(value, "utf8").digest("hex")
    : null;
}

export async function listPrivateEmailDrafts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(emailDrafts)
    .orderBy(desc(emailDrafts.receivedAt))
    .limit(100);
}

export async function listPrivateEmailDraftAudit(draftId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(emailDraftAudit)
    .where(eq(emailDraftAudit.draftId, draftId))
    .orderBy(asc(emailDraftAudit.occurredAt));
}

export async function updatePrivateEmailDraft(
  id: number,
  values: {
    status: "draft" | "approved" | "rejected" | "archived";
    draftBody?: string;
    reviewedByUserId: number;
  }
) {
  const db = await getDb();
  if (!db) return false;
  const current = await db
    .select()
    .from(emailDrafts)
    .where(eq(emailDrafts.id, id))
    .limit(1);
  if (!current[0]) return false;

  const previousHash = hashDraftBody(current[0].draftBody);
  const nextHash = hashDraftBody(values.draftBody ?? current[0].draftBody);
  await db.insert(emailDraftAudit).values({
    draftId: id,
    actorUserId: values.reviewedByUserId,
    action: values.draftBody ? "review_and_edit" : "status_change",
    previousStatus: current[0].status,
    nextStatus: values.status,
    contentHashBefore: previousHash,
    contentHashAfter: nextHash,
    contentChanged: previousHash !== nextHash ? 1 : 0,
  });
  await db
    .update(emailDrafts)
    .set({
      status: values.status,
      reviewedByUserId: values.reviewedByUserId,
      reviewedAt: new Date(),
      ...(values.draftBody ? { draftBody: values.draftBody } : {}),
    })
    .where(eq(emailDrafts.id, id));
  return true;
}

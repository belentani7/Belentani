import { desc, eq } from "drizzle-orm";
import { emailDrafts } from "../drizzle/schema";
import { getDb } from "./db";

export async function listPrivateEmailDrafts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(emailDrafts)
    .orderBy(desc(emailDrafts.receivedAt))
    .limit(100);
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

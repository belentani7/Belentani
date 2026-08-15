import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";
import { CATALOG_REFRESH_CALLBACK, getAutomationReadiness } from "./automation";
import {
  automationJobs,
  catalogItems,
  changelogEntries,
  emailDrafts,
  emailTemplates,
  mediaResources,
} from "../drizzle/schema";
import { getDb } from "./db";
import {
  and,
  asc,
  count,
  desc,
  eq,
  isNotNull,
  like,
  or,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { AGENT_LIMITS, AGENT_SYSTEM_PROMPT } from "./agentPolicy";
import { getMetrics, recordAgent, recordBusinessEvent } from "./observability";
import {
  fetchAllowedSource,
  parseMarkdownSource,
  validateCandidates,
} from "./catalogIngestion";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "editor")
    throw new TRPCError({ code: "FORBIDDEN" });
  return next();
});
const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 170);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure
      .input(
        z.object({
          query: z.string().trim().max(120).default(""),
          category: z.string().trim().max(120).default("all"),
          tag: z.string().trim().max(80).default(""),
          sort: z.enum(["recent", "name"]).default("recent"),
          page: z.number().int().min(1).default(1),
          pageSize: z.number().int().min(1).max(48).default(24),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db)
          return {
            items: [],
            page: input.page,
            pageSize: input.pageSize,
            total: 0,
            categories: [],
            fallback: true,
          };
        const search = input.query ? `%${input.query}%` : null;
        const clauses = [
          and(
            eq(catalogItems.status, "published"),
            eq(catalogItems.reviewStatus, "approved")
          )!,
        ];
        if (input.category !== "all")
          clauses.push(eq(catalogItems.category, input.category));
        if (input.tag) clauses.push(like(catalogItems.tags, `%${input.tag}%`));
        if (search)
          clauses.push(
            or(
              like(catalogItems.name, search),
              like(catalogItems.category, search),
              like(catalogItems.description, search)
            )!
          );
        const where = and(...clauses);
        const [items, totals, categoryRows] = await Promise.all([
          db
            .select()
            .from(catalogItems)
            .where(where)
            .orderBy(
              input.sort === "name"
                ? asc(catalogItems.name)
                : desc(catalogItems.updatedAt)
            )
            .limit(input.pageSize)
            .offset((input.page - 1) * input.pageSize),
          db.select({ value: count() }).from(catalogItems).where(where),
          db
            .select({ category: catalogItems.category })
            .from(catalogItems)
            .where(
              and(
                eq(catalogItems.status, "published"),
                eq(catalogItems.reviewStatus, "approved")
              )
            )
            .groupBy(catalogItems.category)
            .orderBy(asc(catalogItems.category)),
        ]);
        return {
          items,
          page: input.page,
          pageSize: input.pageSize,
          total: totals[0]?.value ?? 0,
          categories: categoryRows.map(row => row.category),
          fallback: false,
        };
      }),
  }),
  media: router({
    review: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["draft", "published", "archived"]),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Database unavailable",
          });
        await db
          .update(mediaResources)
          .set({ status: input.status })
          .where(eq(mediaResources.id, input.id));
        return { success: true, status: input.status };
      }),
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(mediaResources)
        .where(eq(mediaResources.status, "published"))
        .orderBy(desc(mediaResources.updatedAt))
        .limit(60);
    }),
  }),
  changelog: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(changelogEntries)
        .where(isNotNull(changelogEntries.publishedAt))
        .orderBy(desc(changelogEntries.publishedAt))
        .limit(30);
    }),
  }),
  metrics: router({
    public: publicProcedure.query(() => getMetrics()),
    recordBusinessEvent: publicProcedure
      .input(
        z.object({
          event: z.enum([
            "catalog_opened",
            "agent_opened",
            "agent_query_submitted",
            "resource_opened",
            "transparency_opened",
            "contact_clicked",
          ]),
        })
      )
      .mutation(({ input }) => {
        recordBusinessEvent(input.event);
        return { success: true } as const;
      }),
  }),
  admin: router({
    summary: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db)
        return {
          catalog: 0,
          automations: 0,
          templates: 0,
          databaseAvailable: false,
        };
      const [catalog, automations, templates] = await Promise.all([
        db.select({ value: count() }).from(catalogItems),
        db.select({ value: count() }).from(automationJobs),
        db.select({ value: count() }).from(emailTemplates),
      ]);
      return {
        catalog: catalog[0]?.value ?? 0,
        automations: automations[0]?.value ?? 0,
        templates: templates[0]?.value ?? 0,
        databaseAvailable: true,
      };
    }),
    ingestSource: adminProcedure
      .input(
        z.object({
          sourceName: z.string().trim().min(2).max(180),
          sourceUrl: z.string().url().max(700),
          category: z.string().trim().min(2).max(120),
          license: z.string().trim().max(180).optional(),
          limit: z.number().int().min(1).max(500).default(500),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Database unavailable",
          });
        const markdown = await fetchAllowedSource(input.sourceUrl);
        const candidates = await validateCandidates(
          parseMarkdownSource(markdown, input).slice(0, input.limit)
        );
        if (candidates.length)
          await db
            .insert(catalogItems)
            .values(candidates)
            .onDuplicateKeyUpdate({
              set: {
                name: sql`VALUES(name)`,
                description: sql`VALUES(description)`,
                license: sql`VALUES(license)`,
                contentHash: sql`VALUES(contentHash)`,
                ingestedAt: sql`VALUES(ingestedAt)`,
                reviewStatus: sql`VALUES(reviewStatus)`,
                quarantineReason: sql`VALUES(quarantineReason)`,
                updatedAt: new Date(),
              },
            });
        return {
          discovered: candidates.length,
          quarantined: candidates.filter(
            candidate => candidate.reviewStatus === "quarantined"
          ).length,
          status: "pending_review" as const,
        };
      }),
    catalogReviewQueue: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({
          id: catalogItems.id,
          name: catalogItems.name,
          canonicalUrl: catalogItems.canonicalUrl,
          sourceName: catalogItems.sourceName,
          ingestedAt: catalogItems.ingestedAt,
          reviewStatus: catalogItems.reviewStatus,
          quarantineReason: catalogItems.quarantineReason,
        })
        .from(catalogItems)
        .where(
          or(
            eq(catalogItems.reviewStatus, "pending_review"),
            eq(catalogItems.reviewStatus, "quarantined")
          )
        )
        .orderBy(desc(catalogItems.ingestedAt))
        .limit(100);
    }),
    catalogReview: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          reviewStatus: z.enum([
            "pending_review",
            "approved",
            "quarantined",
            "rejected",
          ]),
          status: z.enum(["draft", "published", "archived"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Database unavailable",
          });
        await db
          .update(catalogItems)
          .set({
            reviewStatus: input.reviewStatus,
            quarantineReason:
              input.reviewStatus === "quarantined"
                ? "Marcado manualmente durante revisión editorial"
                : null,
            ...(input.status ? { status: input.status } : {}),
          })
          .where(eq(catalogItems.id, input.id));
        return { success: true };
      }),
    catalogCreate: adminProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(220),
          category: z.string().trim().min(2).max(120),
          description: z.string().trim().min(10).max(5000),
          url: z.string().url().max(500).optional(),
          tags: z.string().max(1000).optional(),
          status: z.enum(["draft", "published"]).default("draft"),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Database unavailable",
          });
        const slug = `${slugify(input.name)}-${Date.now().toString(36)}`;
        await db.insert(catalogItems).values({
          ...input,
          slug,
          url: input.url ?? null,
          tags: input.tags ?? null,
        });
        return { success: true, slug };
      }),
    emailDrafts: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(emailDrafts)
        .orderBy(desc(emailDrafts.receivedAt))
        .limit(100);
    }),
    emailDraftGenerate: adminProcedure
      .input(
        z.object({
          externalMessageId: z.string().trim().min(1).max(240),
          fromAddress: z.string().email(),
          subject: z.string().trim().min(1).max(500),
          originalBody: z.string().trim().min(1).max(20000),
          receivedAt: z.coerce.date(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Database unavailable",
          });
        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `${AGENT_SYSTEM_PROMPT} Clasifica el correo y redacta un borrador. Nunca afirmes que se ha enviado. Devuelve JSON con category y draftBody.`,
            },
            {
              role: "user",
              content: `Asunto: ${input.subject}\nRemitente: ${input.fromAddress}\nContenido:\n${input.originalBody}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "email_draft",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  draftBody: { type: "string" },
                },
                required: ["category", "draftBody"],
                additionalProperties: false,
              },
            },
          },
        });
        const content = result.choices?.[0]?.message?.content;
        const parsed = JSON.parse(
          typeof content === "string" ? content : ""
        ) as { category: string; draftBody: string };
        await db
          .insert(emailDrafts)
          .values({
            ...input,
            category: parsed.category.slice(0, 120),
            draftBody: parsed.draftBody,
            status: "draft",
          })
          .onDuplicateKeyUpdate({
            set: {
              category: parsed.category.slice(0, 120),
              draftBody: parsed.draftBody,
              status: "draft",
              updatedAt: new Date(),
            },
          });
        return {
          success: true,
          category: parsed.category,
          status: "draft" as const,
        };
      }),
    emailDraftReview: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["draft", "approved", "rejected", "archived"]),
          draftBody: z.string().trim().min(1).max(20000).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Database unavailable",
          });
        await db
          .update(emailDrafts)
          .set({
            status: input.status,
            reviewedByUserId: ctx.user.id,
            reviewedAt: new Date(),
            ...(input.draftBody ? { draftBody: input.draftBody } : {}),
          })
          .where(eq(emailDrafts.id, input.id));
        return { success: true, status: input.status };
      }),
    templates: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(emailTemplates)
        .orderBy(desc(emailTemplates.updatedAt));
    }),
    templateUpsert: adminProcedure
      .input(
        z.object({
          key: z.string().trim().min(2).max(120),
          subject: z.string().trim().min(2).max(300),
          body: z.string().trim().min(2).max(20000),
          status: z.enum(["draft", "active", "archived"]).default("draft"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Database unavailable",
          });
        await db
          .insert(emailTemplates)
          .values({ ...input, updatedByUserId: ctx.user.id })
          .onDuplicateKeyUpdate({
            set: {
              subject: input.subject,
              body: input.body,
              status: input.status,
              updatedByUserId: ctx.user.id,
            },
          });
        return { success: true };
      }),
    automationPreflight: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          callbackPath: z.string().regex(/^\/api\/scheduled\/[a-z0-9-]+$/),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db)
          return { ready: false, reason: "database-unavailable" as const };
        const job = (
          await db
            .select()
            .from(automationJobs)
            .where(eq(automationJobs.id, input.id))
            .limit(1)
        )[0];
        if (!job) return { ready: false, reason: "job-not-found" as const };
        return {
          ready: getAutomationReadiness({
            callbackPath: input.callbackPath,
            hasTaskUid: Boolean(job.scheduleCronTaskUid),
            environment: process.env.NODE_ENV,
          }).ready,
          reason: getAutomationReadiness({
            callbackPath: input.callbackPath,
            hasTaskUid: Boolean(job.scheduleCronTaskUid),
            environment: process.env.NODE_ENV,
          }).reason,
        };
      }),
    automationSetStatus: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["draft", "active", "paused", "failed"]),
          callbackPath: z.string().regex(/^\/api\/scheduled\/[a-z0-9-]+$/),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Database unavailable",
          });
        const job = (
          await db
            .select()
            .from(automationJobs)
            .where(eq(automationJobs.id, input.id))
            .limit(1)
        )[0];
        if (!job)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Automation not found",
          });
        if (
          input.status === "active" &&
          (input.callbackPath !== CATALOG_REFRESH_CALLBACK ||
            !job.scheduleCronTaskUid ||
            process.env.NODE_ENV !== "production")
        )
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message:
              "Preflight required: deploy the callback to production and verify its task UID before activation",
          });
        await db
          .update(automationJobs)
          .set({ status: input.status })
          .where(eq(automationJobs.id, input.id));
        return { success: true, status: input.status };
      }),
    automations: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select()
        .from(automationJobs)
        .orderBy(desc(automationJobs.updatedAt));
    }),
  }),
  agent: router({
    respond: publicProcedure
      .input(
        z.object({
          message: z.string().trim().min(1).max(AGENT_LIMITS.maxMessageChars),
          history: z
            .array(
              z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string().max(AGENT_LIMITS.maxMessageChars),
              })
            )
            .max(AGENT_LIMITS.maxHistoryMessages)
            .default([]),
        })
      )
      .mutation(async ({ input }) => {
        const startedAt = Date.now();
        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: AGENT_SYSTEM_PROMPT },
              ...input.history.map(item => ({
                role: item.role,
                content: item.content,
              })),
              { role: "user", content: input.message },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "belentani_agent_response",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    category: { type: "string" },
                    answer: { type: "string" },
                    needsHumanReview: { type: "boolean" },
                  },
                  required: ["category", "answer", "needsHumanReview"],
                  additionalProperties: false,
                },
              },
            },
          });
          const content = response.choices?.[0]?.message?.content;
          const parsed = JSON.parse(
            typeof content === "string" ? content : ""
          ) as { category: string; answer: string; needsHumanReview: boolean };
          if (!parsed.answer) throw new Error("empty-agent-response");
          recordAgent(Date.now() - startedAt, false);
          return { ...parsed, fallback: false };
        } catch (error) {
          console.warn(
            "[Agent] Safe fallback activated",
            error instanceof Error ? error.message : error
          );
          recordAgent(Date.now() - startedAt, true);
          return {
            category: "fallback",
            answer:
              "Puedo orientarte sobre herramientas, recursos, percepción y estrategia de marca. El servicio contextual no está disponible en este momento; puedes escribir a belentani7studio@proton.me para continuar con revisión humana.",
            needsHumanReview: true,
            fallback: true,
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

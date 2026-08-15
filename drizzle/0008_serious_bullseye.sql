CREATE TABLE `email_draft_audit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`draftId` int NOT NULL,
	`actorUserId` int NOT NULL,
	`action` varchar(80) NOT NULL,
	`previousStatus` varchar(32),
	`nextStatus` varchar(32) NOT NULL,
	`contentHashBefore` varchar(128),
	`contentHashAfter` varchar(128),
	`contentChanged` int NOT NULL DEFAULT 0,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_draft_audit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `email_draft_audit_draft_idx` ON `email_draft_audit` (`draftId`);--> statement-breakpoint
CREATE INDEX `email_draft_audit_actor_idx` ON `email_draft_audit` (`actorUserId`);--> statement-breakpoint
CREATE INDEX `email_draft_audit_occurred_idx` ON `email_draft_audit` (`occurredAt`);
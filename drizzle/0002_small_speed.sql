CREATE TABLE `email_drafts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalMessageId` varchar(240) NOT NULL,
	`fromAddress` varchar(320) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`receivedAt` timestamp NOT NULL,
	`category` varchar(120) NOT NULL,
	`originalBody` text NOT NULL,
	`draftBody` text NOT NULL,
	`status` enum('draft','approved','rejected','archived') NOT NULL DEFAULT 'draft',
	`reviewedByUserId` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_drafts_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_drafts_externalMessageId_unique` UNIQUE(`externalMessageId`)
);
--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `sourceName` varchar(180);--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `sourceUrl` varchar(700);--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `license` varchar(180);--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `contentHash` varchar(128);--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `ingestedAt` timestamp;--> statement-breakpoint
ALTER TABLE `catalog_items` ADD `reviewStatus` enum('pending_review','approved','quarantined','rejected') DEFAULT 'pending_review' NOT NULL;--> statement-breakpoint
CREATE INDEX `email_draft_status_idx` ON `email_drafts` (`status`);--> statement-breakpoint
CREATE INDEX `email_draft_received_idx` ON `email_drafts` (`receivedAt`);--> statement-breakpoint
CREATE INDEX `catalog_review_status_idx` ON `catalog_items` (`reviewStatus`);--> statement-breakpoint
CREATE INDEX `catalog_source_idx` ON `catalog_items` (`sourceName`);
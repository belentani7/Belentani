CREATE TABLE `automation_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`cronExpression` varchar(80) NOT NULL,
	`schedule_cron_task_uid` varchar(65),
	`status` enum('draft','active','paused','failed') NOT NULL DEFAULT 'draft',
	`lastRunAt` timestamp,
	`nextRunAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automation_jobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `automation_jobs_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `catalog_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(220) NOT NULL,
	`category` varchar(120) NOT NULL,
	`description` text NOT NULL,
	`url` varchar(500),
	`tags` text,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `catalog_items_id` PRIMARY KEY(`id`),
	CONSTRAINT `catalog_items_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `changelog_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(220) NOT NULL,
	`summary` text NOT NULL,
	`body` text NOT NULL,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `changelog_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `changelog_entries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `email_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(120) NOT NULL,
	`subject` varchar(300) NOT NULL,
	`body` text NOT NULL,
	`status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_templates_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `media_resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(220) NOT NULL,
	`kind` enum('video','audio','voice','document') NOT NULL,
	`description` text,
	`storageKey` varchar(500) NOT NULL,
	`publicUrl` varchar(700) NOT NULL,
	`durationSeconds` int,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_resources_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_resources_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','editor','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
CREATE INDEX `automation_task_uid_idx` ON `automation_jobs` (`schedule_cron_task_uid`);--> statement-breakpoint
CREATE INDEX `automation_status_idx` ON `automation_jobs` (`status`);--> statement-breakpoint
CREATE INDEX `catalog_category_idx` ON `catalog_items` (`category`);--> statement-breakpoint
CREATE INDEX `catalog_status_idx` ON `catalog_items` (`status`);--> statement-breakpoint
CREATE INDEX `changelog_published_idx` ON `changelog_entries` (`publishedAt`);--> statement-breakpoint
CREATE INDEX `media_kind_idx` ON `media_resources` (`kind`);--> statement-breakpoint
CREATE INDEX `media_status_idx` ON `media_resources` (`status`);
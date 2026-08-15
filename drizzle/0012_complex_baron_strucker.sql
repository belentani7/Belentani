ALTER TABLE `automation_runs` ADD `attempt` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `automation_runs` ADD `maxAttempts` int DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE `automation_runs` ADD `timeoutMs` int DEFAULT 120000 NOT NULL;--> statement-breakpoint
ALTER TABLE `automation_runs` ADD `deadLetteredAt` timestamp;--> statement-breakpoint
ALTER TABLE `automation_runs` ADD `quarantineReason` varchar(500);
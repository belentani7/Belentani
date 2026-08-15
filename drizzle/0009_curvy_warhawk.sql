CREATE TABLE `automation_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int,
	`taskUid` varchar(65),
	`status` enum('running','succeeded','failed','skipped') NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`finishedAt` timestamp,
	`durationMs` int,
	`snapshot` text,
	`error` text,
	CONSTRAINT `automation_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `automation_run_job_idx` ON `automation_runs` (`jobId`);--> statement-breakpoint
CREATE INDEX `automation_run_status_idx` ON `automation_runs` (`status`);--> statement-breakpoint
CREATE INDEX `automation_run_started_idx` ON `automation_runs` (`startedAt`);
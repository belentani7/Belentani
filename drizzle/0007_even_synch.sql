CREATE TABLE `business_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event` varchar(48) NOT NULL,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `business_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `business_event_name_idx` ON `business_events` (`event`);--> statement-breakpoint
CREATE INDEX `business_event_time_idx` ON `business_events` (`occurredAt`);
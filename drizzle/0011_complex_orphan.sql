CREATE TABLE `admin_action_audit` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(80) NOT NULL,
	`entityId` int,
	`outcome` enum('success','failure') NOT NULL,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_action_audit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `admin_audit_actor_idx` ON `admin_action_audit` (`actorUserId`);--> statement-breakpoint
CREATE INDEX `admin_audit_entity_idx` ON `admin_action_audit` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `admin_audit_occurred_idx` ON `admin_action_audit` (`occurredAt`);
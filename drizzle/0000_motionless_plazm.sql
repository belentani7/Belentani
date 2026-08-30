CREATE TABLE `pvc_exceptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`exceptionId` varchar(64) NOT NULL,
	`tenantKey` varchar(64) NOT NULL,
	`profileId` varchar(128) NOT NULL,
	`reason` text NOT NULL,
	`compensatingControls` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`approvedBy` varchar(128) NOT NULL,
	`status` enum('active','expired','revoked') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pvc_exceptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `pvc_exceptions_exceptionId_unique` UNIQUE(`exceptionId`)
);
--> statement-breakpoint
CREATE TABLE `pvc_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantKey` varchar(64) NOT NULL,
	`profileId` varchar(128) NOT NULL,
	`version` varchar(32) NOT NULL,
	`riskClass` enum('low','medium','high','critical') NOT NULL,
	`domain` varchar(64) NOT NULL,
	`definition` json NOT NULL,
	`status` enum('draft','active','deprecated','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pvc_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pvc_tenants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantKey` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`tier` enum('individual','business','enterprise') NOT NULL DEFAULT 'business',
	`status` enum('active','suspended','quarantine') NOT NULL DEFAULT 'active',
	`config` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pvc_tenants_id` PRIMARY KEY(`id`),
	CONSTRAINT `pvc_tenants_tenantKey_unique` UNIQUE(`tenantKey`)
);
--> statement-breakpoint
CREATE TABLE `pvc_validations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`validationId` varchar(64) NOT NULL,
	`tenantKey` varchar(64) NOT NULL,
	`profileId` varchar(128) NOT NULL,
	`artifactType` varchar(64) NOT NULL,
	`riskClass` varchar(32) NOT NULL,
	`status` enum('approved','rejected','quarantine','degraded','human_review') NOT NULL,
	`spheresPassed` json,
	`failedSphere` varchar(64),
	`failureReason` text,
	`evidenceHash` varchar(128) NOT NULL,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pvc_validations_id` PRIMARY KEY(`id`),
	CONSTRAINT `pvc_validations_validationId_unique` UNIQUE(`validationId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);

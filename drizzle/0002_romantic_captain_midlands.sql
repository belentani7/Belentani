CREATE TABLE `pvc_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evidenceId` varchar(96) NOT NULL,
	`validationId` varchar(64) NOT NULL,
	`tenantKey` varchar(64) NOT NULL,
	`evidenceHash` varchar(128) NOT NULL,
	`algorithm` varchar(32) NOT NULL DEFAULT 'sha256',
	`provenance` json,
	`retentionUntil` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pvc_evidence_id` PRIMARY KEY(`id`),
	CONSTRAINT `pvc_evidence_evidenceId_unique` UNIQUE(`evidenceId`)
);

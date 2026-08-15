ALTER TABLE `catalog_items` ADD `canonicalUrl` varchar(700);--> statement-breakpoint
ALTER TABLE `catalog_items` ADD CONSTRAINT `catalog_items_canonicalUrl_unique` UNIQUE(`canonicalUrl`);
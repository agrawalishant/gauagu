alter table `stocks` add `inventory_status` tinyint(4) DEFAULT NULL after `status`;
alter table `stocks` add `qc_status` tinyint(4) DEFAULT NULL after `inventory_status`;
alter table `stocks` add `supplier_id`  int(100) DEFAULT NULL after `any_other_treatment`;
alter table `stocks` add `image_url` varchar(200) NOT NULL DEFAULT 'https://staging.gaugau.co/img/stocks/' after `form`;

INSERT INTO `campaigns` VALUES (4,'Formula-1','[  \r\n       {  \r\n     \"Supplier\":\"1,2\",\r\n         \"Cattle_Type\": \"\'Cow\',\'Buffalo\'\",  \r\n         \"Breed\": \"\'Sahiwal\',\'Gir\',\'Murrah\'\",  \r\n         \"Milk_Capacity\": \"4,5,6\",  \r\n         \"Qc_status\": \"3\",  \r\n \"Lactation\":\"\'lactation one\',\'lactation two\'\",\r\n \"Deliver_Status\":\"\'milking\',\'non_milking\'\",\r\n         \"price\":\"5000,4000\"\r\n \r\n       }\r\n      \r\n\r\n]','','2022-01-21','2022-06-24 09:13:29',1,NULL,NULL);

SELECT name FROM states INTO OUTFILE '/var/lib/mysql-files/' FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';

UPDATE stocks SET inventory_status = 1 WHERE `id` != 0;


UPDATE `stocks` SET `supplier_id`= 1, `animal_type`='Cow', `animal_breed`='Sahiwal',`milk_capacity` = 4, `qc_status`=3,`lactation_number`= 'lactation one', `pregnancy_delivery_time`='milking',`base_price` = '4500' ,`inventory_status`=1 WHERE `id` = 240;




-- making premutations and combinations

UPDATE `stocks` SET `supplier_id`= 1, `animal_type`='Buffalo', `animal_breed`='Sahiwal',`milk_capacity` = 4, `qc_status`=3,`lactation_number`= 'lactation one', `pregnancy_delivery_time`='milking',`base_price` = '4500' ,`inventory_status`=1 WHERE `id` = 233;

UPDATE `stocks` SET `supplier_id`= 1, `animal_type`='Buffalo', `animal_breed`='Murrah',`milk_capacity` = 4, `qc_status`=3,`lactation_number`= 'lactation one', `pregnancy_delivery_time`='milking',`base_price` = '4500' ,`inventory_status`=1 WHERE `id` = 236;

UPDATE `stocks` SET `supplier_id`= 1, `animal_type`='Buffalo', `animal_breed`='Murrah',`milk_capacity` = 4, `qc_status`=3,`lactation_number`= 'lactation two', `pregnancy_delivery_time`='milking',`base_price` = '4500' ,`inventory_status`=1 WHERE `id` = 243;

UPDATE `stocks` SET `supplier_id` = 1 WHERE `id`!=0;

UPDATE `stocks` SET `animal_type` = 'Cow' WHERE `id`<=259;
UPDATE `stocks` SET `animal_type` = 'Buffalo' WHERE `id` > 259;

UPDATE `stocks` SET `animal_breed` = 'Sahiwal' WHERE `id`<=250;
UPDATE `stocks` SET `animal_breed` = 'Gir' WHERE `id`BETWEEN 250 AND 267;
UPDATE `stocks` SET `animal_breed` = 'Murrah' WHERE `id` >= 267;

UPDATE `stocks` SET `milk_capacity` = 6 WHERE `id`<=250;
UPDATE `stocks` SET `milk_capacity` = 5 WHERE `id`BETWEEN 250 AND 267;
UPDATE `stocks` SET `milk_capacity` = 4 WHERE `id` >= 267;

UPDATE `stocks` SET `qc_status` = 3 WHERE `id` in( 233,237,242,249,257,261,279,286);
UPDATE `stocks` SET `qc_status` = 5 WHERE `id`BETWEEN 250 AND 267;
UPDATE `stocks` SET `qc_status` = 4 WHERE `id` >= 267;

UPDATE `stocks` SET `pregnancy_delivery_time` = 'non_milking' WHERE `id` %2 = 0;

UPDATE `stocks` SET `base_price` = 4900 WHERE `id` >=260;

ALTER TABLE gaugau_db_2.stock_images 
AUTO_INCREMENT=1000;


INSERT INTO `stock_images` VALUES 
(500,280,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(501,280,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(502,280,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),

(503,281,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(504,281,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(505,281,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),

(506,282,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(507,282,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(508,282,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),

(509,283,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(510,283,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(511,283,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),

(512,284,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(513,284,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(514,284,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),

(515,285,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(516,285,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(517,285,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),

(518,286,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(519,286,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(520,286,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),

(521,287,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(522,287,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(523,287,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),

(524,288,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(525,288,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(526,288,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),

(527,289,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(528,289,'243/angle3.jpeg',NULL,'video','video','2022-02-11 11:53:57','2022-02-11 11:53:57'),
(529,289,'243/angle2.jpeg',NULL,'angle2','image','2022-02-11 11:53:57','2022-02-11 11:53:57');



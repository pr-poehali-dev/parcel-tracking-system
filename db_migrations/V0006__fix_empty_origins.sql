-- Исправляем старые записи с пустыми origin и destination
UPDATE packages 
SET origin = 'China', destination = 'China' 
WHERE (origin = '' OR origin IS NULL) AND id IN (53, 49, 40);
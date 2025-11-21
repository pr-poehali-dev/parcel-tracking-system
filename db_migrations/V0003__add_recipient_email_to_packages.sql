-- Add recipient_email column for email notifications
ALTER TABLE packages ADD COLUMN recipient_email VARCHAR(255);

-- Add index for faster email lookups
CREATE INDEX idx_packages_recipient_email ON packages(recipient_email);
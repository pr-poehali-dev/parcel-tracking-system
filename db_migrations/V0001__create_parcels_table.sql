-- Create parcels table for Aboba Express tracking system
CREATE TABLE IF NOT EXISTS parcels (
    id SERIAL PRIMARY KEY,
    tracking_code VARCHAR(50) UNIQUE NOT NULL,
    recipient_first_name VARCHAR(100) NOT NULL,
    recipient_last_name VARCHAR(100) NOT NULL,
    recipient_address TEXT NOT NULL,
    current_location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on tracking_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_tracking_code ON parcels(tracking_code);

-- Insert sample data
INSERT INTO parcels (tracking_code, recipient_first_name, recipient_last_name, recipient_address, current_location, status) VALUES
('AB2024001', 'Иван', 'Петров', 'Москва, ул. Ленина, д. 10, кв. 25', 'Склад Москва', 'in_transit'),
('AB2024002', 'Мария', 'Сидорова', 'Санкт-Петербург, Невский пр., д. 45', 'В пути - Тверь', 'in_transit'),
('AB2024003', 'Алексей', 'Смирнов', 'Казань, ул. Пушкина, д. 7', 'Склад Казань', 'ready_for_pickup');
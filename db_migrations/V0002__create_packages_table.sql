CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    tracking_code VARCHAR(20) UNIQUE NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_address TEXT NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_address TEXT NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    estimated_delivery DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tracking_code ON packages(tracking_code);
CREATE INDEX IF NOT EXISTS idx_status ON packages(status);

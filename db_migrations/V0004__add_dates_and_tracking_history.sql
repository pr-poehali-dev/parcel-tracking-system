-- Add shipped_date and delivered_date columns to packages
ALTER TABLE packages ADD COLUMN shipped_date TIMESTAMP;
ALTER TABLE packages ADD COLUMN delivered_date TIMESTAMP;

-- Create tracking_history table for package movement history
CREATE TABLE tracking_history (
    id SERIAL PRIMARY KEY,
    package_id INTEGER NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_tracking_history_package_id ON tracking_history(package_id);
CREATE INDEX idx_tracking_history_event_date ON tracking_history(event_date DESC);
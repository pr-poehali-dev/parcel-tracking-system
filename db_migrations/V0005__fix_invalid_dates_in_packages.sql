-- Fix invalid dates with year 20026 to 2026
UPDATE t_p50689379_parcel_tracking_syst.packages
SET 
    estimated_delivery = CASE 
        WHEN EXTRACT(YEAR FROM estimated_delivery) > 10000 
        THEN (estimated_delivery - INTERVAL '18000 years')::date
        ELSE estimated_delivery
    END,
    shipped_date = CASE 
        WHEN shipped_date IS NOT NULL AND EXTRACT(YEAR FROM shipped_date) > 10000 
        THEN (shipped_date - INTERVAL '18000 years')::timestamp
        ELSE shipped_date
    END,
    delivered_date = CASE 
        WHEN delivered_date IS NOT NULL AND EXTRACT(YEAR FROM delivered_date) > 10000 
        THEN (delivered_date - INTERVAL '18000 years')::timestamp
        ELSE delivered_date
    END
WHERE 
    EXTRACT(YEAR FROM estimated_delivery) > 10000
    OR (shipped_date IS NOT NULL AND EXTRACT(YEAR FROM shipped_date) > 10000)
    OR (delivered_date IS NOT NULL AND EXTRACT(YEAR FROM delivered_date) > 10000);

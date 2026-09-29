-- =====================================================================================
-- ONDE DORMIR MOÇAMBIQUE - PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Powered by Águia Soluções & Serviços - Conexões Rápidas, SU, LDA
-- =====================================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
CREATE TYPE user_role_enum AS ENUM ('USER', 'OWNER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE property_status_enum AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'REMOVED');
CREATE TYPE verification_level_enum AS ENUM ('NOT_VERIFIED', 'VERIFIED', 'VERIFIED_PLUS', 'VERIFIED_ON_SITE');
CREATE TYPE report_status_enum AS ENUM ('NEW', 'UNDER_REVIEW', 'VALID', 'INVALID', 'RESOLVED', 'CLOSED');
CREATE TYPE doc_type_enum AS ENUM ('BI_FRONT', 'BI_BACK', 'SELFIE_LIVENESS', 'ALVARA_COMERCIAL', 'LIVRETE_VEICULO', 'TITULO_PROPRIEDADE');

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. OWNERS TABLE
CREATE TABLE IF NOT EXISTS owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200),
    nuit VARCHAR(20),
    commercial_registry_number VARCHAR(100),
    support_phone VARCHAR(20) NOT NULL,
    support_whatsapp VARCHAR(20),
    is_verified_owner BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_owners_user_id ON owners(user_id);

-- 3. PROVINCES, CITIES, DISTRICTS, BEACHES
CREATE TABLE IF NOT EXISTS provinces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    region VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province_id UUID NOT NULL REFERENCES provinces(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cities_province_id ON cities(province_id);

CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_districts_city_id ON districts(city_id);

CREATE TABLE IF NOT EXISTS beaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province_id UUID NOT NULL REFERENCES provinces(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province_id UUID NOT NULL REFERENCES provinces(id),
    city_id UUID NOT NULL REFERENCES cities(id),
    district_id UUID REFERENCES districts(id),
    beach_id UUID REFERENCES beaches(id),
    address_line VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    landmark VARCHAR(150),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_locations_province_city ON locations(province_id, city_id);

-- 5. PROPERTIES TABLE (Alojamentos)
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location_id UUID NOT NULL REFERENCES locations(id),
    contact_phone VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    status property_status_enum NOT NULL DEFAULT 'PENDING_REVIEW',
    verification_level verification_level_enum NOT NULL DEFAULT 'NOT_VERIFIED',
    premium_status BOOLEAN NOT NULL DEFAULT FALSE,
    is_open_24h BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_verification_level ON properties(verification_level);
CREATE INDEX IF NOT EXISTS idx_properties_premium_status ON properties(premium_status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);

-- 6. PROPERTY PHOTOS TABLE
CREATE TABLE IF NOT EXISTS property_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    storage_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_property_photos_property_id ON property_photos(property_id);

-- 7. ROOMS AND PRICES
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    capacity_adults INTEGER NOT NULL DEFAULT 2,
    capacity_children INTEGER NOT NULL DEFAULT 0,
    bed_type VARCHAR(50) NOT NULL,
    has_private_bathroom BOOLEAN NOT NULL DEFAULT TRUE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS room_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    price_mzn DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'MZN',
    pricing_tier VARCHAR(50) NOT NULL DEFAULT 'standard',
    valid_from DATE NOT NULL,
    valid_to DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AMENITIES TABLE
CREATE TABLE IF NOT EXISTS amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS property_amenities (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- 9. VERIFICATION REQUESTS, DOCUMENTS, AND RESULTS
CREATE TABLE IF NOT EXISTS verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    reviewer_admin_id UUID REFERENCES users(id),
    notes TEXT,
    retention_expiry_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_request_id UUID NOT NULL REFERENCES verification_requests(id) ON DELETE CASCADE,
    document_type doc_type_enum NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    file_hash_sha256 VARCHAR(64) NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    is_purged BOOLEAN NOT NULL DEFAULT FALSE,
    purged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_request_id UUID NOT NULL UNIQUE REFERENCES verification_requests(id) ON DELETE CASCADE,
    liveness_score DECIMAL(5, 2) NOT NULL,
    bi_matching_score DECIMAL(5, 2) NOT NULL,
    decision VARCHAR(50) NOT NULL,
    decision_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    previous_level verification_level_enum NOT NULL,
    new_level verification_level_enum NOT NULL,
    changed_by_admin_id UUID NOT NULL REFERENCES users(id),
    action_summary VARCHAR(255) NOT NULL,
    administrative_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. REPORTS TABLE (Denúncias)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_ip_hash VARCHAR(64) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    reason VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    status report_status_enum NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

CREATE TABLE IF NOT EXISTS report_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES users(id),
    action_taken VARCHAR(50) NOT NULL,
    justification TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 12. ANALYTICS EVENTS (Minimizados para privacidade)
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    province_code VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type, created_at DESC);

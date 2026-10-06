/**
 * ONDE DORMIR MOÇAMBIQUE - Relational Database Entities & Enums
 * Production-ready schema interfaces for PostgreSQL / Supabase
 */

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'REJECTED'
  | 'REMOVED';

export type VerificationLevel =
  | 'NOT_VERIFIED'
  | 'VERIFIED'
  | 'VERIFIED_PLUS'
  | 'VERIFIED_ON_SITE';

export type ReportStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'VALID'
  | 'INVALID'
  | 'RESOLVED'
  | 'CLOSED';

export type VerificationDocumentType =
  | 'BI_FRONT'
  | 'BI_BACK'
  | 'SELFIE_LIVENESS'
  | 'ALVARA_COMERCIAL'
  | 'LIVRETE_VEICULO'
  | 'TITULO_PROPRIEDADE';

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface DbUser extends BaseEntity {
  phone_number: string;
  phone_verified: boolean;
  email?: string | null;
  full_name: string;
  role: 'USER' | 'OWNER' | 'ADMIN' | 'SUPER_ADMIN' | 'PLATFORM_OWNER';
  is_active: boolean;
  last_login_at?: string | null;
}

export interface DbOwner extends BaseEntity {
  user_id: string;
  company_name?: string | null;
  nuit?: string | null; // Número Único de Identificação Tributária
  commercial_registry_number?: string | null;
  support_phone: string;
  support_whatsapp?: string | null;
  is_verified_owner: boolean;
}

export interface DbProvince extends BaseEntity {
  name: string;
  code: string;
  region: 'Norte' | 'Centro' | 'Sul';
}

export interface DbCity extends BaseEntity {
  province_id: string;
  name: string;
}

export interface DbDistrict extends BaseEntity {
  city_id: string;
  name: string;
}

export interface DbBeach extends BaseEntity {
  province_id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface DbLocation extends BaseEntity {
  province_id: string;
  city_id: string;
  district_id?: string | null;
  beach_id?: string | null;
  address_line: string;
  neighborhood: string;
  landmark?: string | null;
  latitude: number;
  longitude: number;
}

export interface DbProperty extends BaseEntity {
  owner_id: string;
  name: string;
  category: 'pensao' | 'hotel' | 'guest_house' | 'lodge' | 'residencial';
  tagline: string;
  description: string;
  location_id: string;
  contact_phone: string;
  whatsapp_number?: string | null;
  status: PropertyStatus;
  verification_level: VerificationLevel;
  premium_status: boolean;
  is_open_24h: boolean;
  published_at?: string | null;
}

export interface DbPropertyPhoto extends BaseEntity {
  property_id: string;
  storage_path: string;
  thumbnail_path: string;
  mime_type: string;
  file_size_bytes: number;
  display_order: number;
  is_cover: boolean;
}

export interface DbRoom extends BaseEntity {
  property_id: string;
  name: string;
  capacity_adults: number;
  capacity_children: number;
  bed_type: string;
  has_private_bathroom: boolean;
  is_available: boolean;
}

export interface DbRoomPrice extends BaseEntity {
  room_id: string;
  price_mzn: number;
  currency: 'MZN';
  pricing_tier: 'standard' | 'high_season' | 'weekend';
  valid_from: string;
  valid_to?: string | null;
}

export interface DbAmenity extends BaseEntity {
  code: string;
  name: string;
  icon_name: string;
  category: 'comfort' | 'security' | 'dining' | 'utilities';
}

export interface DbPropertyAmenity {
  property_id: string;
  amenity_id: string;
  created_at: string;
}

export interface DbVerificationRequest extends BaseEntity {
  user_id: string;
  target_type: 'USER_PROFILE' | 'OWNER_ACCOUNT' | 'VEHICLE' | 'TOUR_GUIDE';
  target_id: string;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewer_admin_id?: string | null;
  notes?: string | null;
  retention_expiry_at: string; // Documents wiped after retention period
}

export interface DbVerificationDocument extends BaseEntity {
  verification_request_id: string;
  document_type: VerificationDocumentType;
  storage_path: string; // Path in secure object storage
  file_hash_sha256: string;
  mime_type: string;
  file_size_bytes: number;
  is_purged: boolean;
  purged_at?: string | null;
}

export interface DbVerificationResult extends BaseEntity {
  verification_request_id: string;
  liveness_score: number;
  bi_matching_score: number;
  decision: 'APPROVED' | 'REJECTED' | 'MANUAL_AUDIT_REQUIRED';
  decision_reasons: string[];
}

export interface DbVerificationHistory extends BaseEntity {
  target_type: 'PROPERTY' | 'USER' | 'VEHICLE' | 'GUIDE';
  target_id: string;
  previous_level: VerificationLevel;
  new_level: VerificationLevel;
  changed_by_admin_id: string;
  action_summary: string;
  administrative_notes?: string | null;
}

export interface DbReport extends BaseEntity {
  reporter_user_id?: string | null; // Can be anonymous or registered
  reporter_ip_hash: string;
  target_type: 'PROPERTY' | 'VEHICLE' | 'TOUR_GUIDE' | 'HEARTLINK_PROFILE';
  target_id: string;
  reason: 'FRAUD' | 'MISLEADING_INFO' | 'INAPPROPRIATE_CONTENT' | 'SAFETY_CONCERN' | 'OTHER';
  details: string;
  status: ReportStatus;
}

export interface DbReportAction extends BaseEntity {
  report_id: string;
  admin_id: string;
  action_taken: 'DISMISSED' | 'WARNING_SENT' | 'SUSPENDED_RESOURCE' | 'BANNED_USER';
  justification: string;
}

export interface DbSubscription extends BaseEntity {
  owner_id: string;
  resource_type: 'PROPERTY' | 'VEHICLE' | 'HEARTLINK_VISIBILITY';
  resource_id: string;
  plan_code: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  starts_at: string;
  expires_at: string;
  amount_mzn: number;
}

export interface DbFavorite {
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface DbAnalyticsEvent {
  id: string;
  event_type: 'property_view' | 'search' | 'favorite' | 'whatsapp_click' | 'phone_click' | 'map_click';
  resource_id?: string | null;
  province_code?: string | null;
  created_at: string;
}

export interface DbAdminUser extends BaseEntity {
  user_id: string;
  permissions: string[];
  is_active: boolean;
  super_admin_assigned_by: string;
}

export interface DbAuditLog {
  id: string;
  actor_id: string;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id: string;
  previous_state?: Record<string, any> | null;
  new_state?: Record<string, any> | null;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export type FloodSeverity =
    | 'safe'
    | 'warning'
    | 'alert'
    | 'high_alert'
    | 'danger';

export type FloodReportStatus =
    | 'submitted'
    | 'verification'
    | 'verified'
    | 'published'
    | 'rejected'
    | 'expired';

export interface FloodReport {
    id: number;

    user_id: number;

    latitude: number;
    longitude: number;

    address: string | null;

    water_level: number;

    severity: FloodSeverity;

    description: string | null;

    status: FloodReportStatus;

    reported_at: string;

    verified_at: string | null;
    verified_by: number | null;

    expired_at: string | null;

    created_at: string;
    updated_at: string;
}

export type FloodAreaSeverity =
    | 'safe'
    | 'warning'
    | 'alert'
    | 'high_alert'
    | 'danger';

export type FloodAreaStatus =
    | 'active'
    | 'inactive'
    | 'expired';

export interface FloodAreaGeometry {
    type: 'Polygon' | 'MultiPolygon';

    coordinates: number[][][] | number[][][][];
}

export interface FloodArea {
    id: number;

    name: string;

    code: string;

    geometry: FloodAreaGeometry;

    severity: FloodAreaSeverity;

    status: FloodAreaStatus;

    description: string | null;

    created_at: string;

    updated_at: string;
}

export type FloodLevelSeverity =
    | 'safe'
    | 'warning'
    | 'alert'
    | 'high_alert'
    | 'danger';

export type FloodLevelStatus =
    | 'active'
    | 'inactive'
    | 'expired';

export interface FloodLevelGeometry {
    type: 'Polygon' | 'MultiPolygon';

    coordinates: number[][][] | number[][][][];
}

export interface FloodLevel {
    id: number;

    name: string;

    code: string;

    geometry: FloodLevelGeometry;

    severity: FloodLevelSeverity;

    status: FloodLevelStatus;

    description: string | null;

    created_at: string;

    updated_at: string;
}
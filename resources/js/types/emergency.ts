export type EmergencyContactCategory =
    | 'bpbd'
    | 'damkar'
    | 'police'
    | 'ambulance'
    | 'hospital'
    | 'search_rescue'
    | 'government'
    | 'other';

export type EmergencyContactStatus =
    | 'active'
    | 'inactive';

export interface EmergencyContact {
    id: number;

    name: string;

    category: EmergencyContactCategory;

    phone: string;

    description: string | null;

    latitude: number | null;

    longitude: number | null;

    status: EmergencyContactStatus;

    created_at: string;

    updated_at: string;
}
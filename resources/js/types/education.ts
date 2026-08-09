export type EducationContentStatus =
    | 'draft'
    | 'published'
    | 'archived';

export interface EducationCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface EducationContent {
    id: number;

    category_id: number;

    title: string;

    slug: string;

    thumbnail: string | null;

    content: string | null;

    video_url: string | null;

    status: EducationContentStatus;

    published_at: string | null;

    created_at: string;

    updated_at: string;

    category?: EducationCategory;
}
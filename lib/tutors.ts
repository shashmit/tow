export const SUBJECTS = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "English Literature",
    "Computer Science",
    "History",
    "Art",
];

export const METHODS = ["Online", "Offline", "Hybrid"] as const;

export type TeachingMethod = (typeof METHODS)[number];

export interface Tutor {
    id: string | number;
    name: string;
    subjects: string[];
    role: string;
    exp: string;
    methods: TeachingMethod[];
    rate: string;
    rating: number;
    reviews: number;
    image: string;
    bio: string;
    featured: boolean;
    classLevels: string[];
    availability: {
        day: string; // "Monday", "Tuesday", etc.
        slots: string[]; // ["10:00 AM", "2:00 PM"]
    }[];
}

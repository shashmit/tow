import { Monitor, MapPin, Users } from "lucide-react";
import { TeachingMethod } from "@/lib/mock-tutors";

interface MethodBadgeProps {
    method: TeachingMethod;
}

const styles: Record<TeachingMethod, string> = {
    Online: "bg-blue-100 text-blue-800 border-blue-300",
    Offline: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Hybrid: "bg-purple-100 text-purple-800 border-purple-300",
};

const icons: Record<TeachingMethod, React.ReactNode> = {
    Online: <Monitor size={12} className="mr-1" />,
    Offline: <MapPin size={12} className="mr-1" />,
    Hybrid: <Users size={12} className="mr-1" />,
};

export function MethodBadge({ method }: MethodBadgeProps) {
    return (
        <span
            className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold border-2 ${styles[method]}`}
        >
            {icons[method]}
            {method}
        </span>
    );
}

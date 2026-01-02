"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
    placeholder?: string;
    tags: string[];
    onTagsChange: (tags: string[]) => void;
}

export function TagInput({ placeholder, tags, onTagsChange }: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                onTagsChange([...tags, newTag]);
                setInputValue("");
            }
        } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            onTagsChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="rounded-2xl border-2 border-gray-200 bg-gray-50/50 p-3 focus-within:border-black focus-within:bg-white transition-all">
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="px-3 py-1.5 gap-1.5 text-sm font-medium bg-black text-white hover:bg-gray-800 border-0"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Type and press Enter..."}
                className="border-0 bg-transparent p-0 h-auto text-base font-medium placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        </div>
    );
}

"use client";

import { Input } from "@/components/ui/input";
import { User, Calendar, Users, Phone, MapPin, FileText, Camera, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/appwrite/client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PersonalDetailsProps {
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: any;
}

export function CombinedPersonalDetails({ formData, handleInputChange, setFormData }: PersonalDetailsProps) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Clean up preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create local preview immediately
        const localPreviewUrl = URL.createObjectURL(file);
        setPreviewUrl(localPreviewUrl);

        try {
            setUploading(true);
            const result = await uploadFile(file);
            // Update form with the server-returned URL
            setFormData((prev: any) => ({ ...prev, imageUrl: result.fileUrl }));
        } catch (error) {
            console.error("Error uploading image:", error);
            // Clear preview on error
            setPreviewUrl(null);
            URL.revokeObjectURL(localPreviewUrl);
        } finally {
            setUploading(false);
        }
    };

    // Determine which image to display: local preview during upload, or saved imageUrl
    const displayImageUrl = previewUrl || formData.imageUrl;

    return (
        <div className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm relative bg-gray-50">
                        {displayImageUrl ? (
                            <Image
                                src={displayImageUrl}
                                alt="Profile"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <User className="w-10 h-10" />
                            </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                            <Camera className="w-6 h-6 text-white" />
                        </div>

                        {/* Loading State */}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 transition-all">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        disabled={uploading}
                    />
                </div>
                <p className="text-sm font-medium text-gray-500">Upload Profile Photo</p>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <User className="w-4 h-4" />
                    Full Name
                </label>
                <Input
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="h-14 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-base font-medium placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-0 transition-all"
                />
            </div>

            {/* Grid: Age & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Calendar className="w-4 h-4" />
                        Age
                    </label>
                    <Input
                        name="age"
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="h-14 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-base font-medium placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-0 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Users className="w-4 h-4" />
                        Gender
                    </label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full h-14 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-base font-medium text-gray-700 focus:border-black focus:bg-white focus:outline-none focus:ring-0 transition-all appearance-none cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                        }}
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                </div>
            </div>

            {/* Grid: Phone & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Phone className="w-4 h-4" />
                        Phone Number
                    </label>
                    <Input
                        name="phoneNumber"
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="h-14 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-base font-medium placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-0 transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <MapPin className="w-4 h-4" />
                        Location
                    </label>
                    <Input
                        name="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="h-14 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-base font-medium placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-0 transition-all"
                    />
                </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <FileText className="w-4 h-4" />
                    Bio (Optional)
                </label>
                <textarea
                    name="bio"
                    placeholder="Tell us a bit about yourself, your interests, goals..."
                    rows={4}
                    className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3 text-base font-medium placeholder:text-gray-400 focus:border-black focus:bg-white focus:outline-none focus:ring-0 transition-all resize-none"
                    value={formData.bio}
                    onChange={handleInputChange}
                />
                <p className="text-xs text-gray-400 text-right">
                    {formData.bio.length}/300 characters
                </p>
            </div>
        </div>
    );
}

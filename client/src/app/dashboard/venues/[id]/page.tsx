'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button, Input } from '@/components/ui';
import { venuesApi, uploadApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Venue {
    _id: string;
    name: string;
    description: string;
    images: string[];
    address: { street: string; city: string; state: string; pincode: string };
    capacity: { min: number; max: number };
    pricing: { basePrice: number; pricePerHour?: number };
    amenities: string[];
    rules: string[];
    availability: { dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }[];
    blockedDates: { date: string; startTime: string; endTime: string; reason: string }[];
    status: string;
    isActive: boolean;
    rating: { average: number; count: number };
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const COMMON_AMENITIES = ['Parking', 'WiFi', 'AC', 'Sound System', 'Projector', 'Stage', 'Green Room', 'Catering', 'Security', 'Restrooms'];

export default function VenueManagePage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        basePrice: 0,
        pricePerHour: 0,
        capacityMin: 1,
        capacityMax: 100,
        amenities: [] as string[],
        rules: [] as string[],
        images: [] as string[],
    });

    // Image management
    const [selectedImage, setSelectedImage] = useState(0);
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [deletingImage, setDeletingImage] = useState<string | null>(null);

    // Calendar state
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [hoursForm, setHoursForm] = useState({ startTime: '09:00', endTime: '22:00', isAvailable: true });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/signin');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (params.id && isAuthenticated) {
            fetchVenue(params.id as string);
        }
    }, [params.id, isAuthenticated]);

    const fetchVenue = async (id: string) => {
        try {
            setIsLoading(true);
            const data = await venuesApi.getById(id);
            setVenue(data as Venue);
            initEditForm(data as Venue);
        } catch (err) {
            setError('Failed to load venue');
        } finally {
            setIsLoading(false);
        }
    };

    const initEditForm = (v: Venue) => {
        setEditForm({
            name: v.name || '',
            description: v.description || '',
            street: v.address?.street || '',
            city: v.address?.city || '',
            state: v.address?.state || '',
            pincode: v.address?.pincode || '',
            basePrice: v.pricing?.basePrice || 0,
            pricePerHour: v.pricing?.pricePerHour || 0,
            capacityMin: v.capacity?.min || 1,
            capacityMax: v.capacity?.max || 100,
            amenities: v.amenities || [],
            rules: v.rules || [],
            images: v.images || [],
        });
        setSelectedImage(0);
    };

    const handleSave = async () => {
        if (!venue) return;
        setIsSaving(true);
        try {
            let allImages = [...editForm.images];
            if (newImageFiles.length > 0) {
                const uploadResult = await uploadApi.multiple(newImageFiles, 'venues');
                allImages = [...allImages, ...uploadResult.images.map(img => img.url)];
            }

            await venuesApi.update(venue._id, {
                name: editForm.name,
                description: editForm.description,
                address: { street: editForm.street, city: editForm.city, state: editForm.state, pincode: editForm.pincode },
                pricing: { basePrice: editForm.basePrice, pricePerHour: editForm.pricePerHour },
                capacity: { min: editForm.capacityMin, max: editForm.capacityMax },
                amenities: editForm.amenities,
                rules: editForm.rules,
                images: allImages,
            });

            setNewImageFiles([]);
            setImagePreviews([]);
            setIsEditMode(false);
            fetchVenue(venue._id);
        } catch (err) {
            setError('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveImage = async (imageUrl: string) => {
        const urlParts = imageUrl.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const filename = filenameWithExt.split('.')[0];
        const folder = urlParts[urlParts.length - 2];
        const publicId = `${folder}/${filename}`;

        setDeletingImage(imageUrl);
        try {
            await uploadApi.delete(publicId);
            setEditForm(prev => ({ ...prev, images: prev.images.filter(img => img !== imageUrl) }));
            if (selectedImage >= editForm.images.length - 1) setSelectedImage(Math.max(0, editForm.images.length - 2));
        } catch (err) {
            setError('Failed to delete image');
        } finally {
            setDeletingImage(null);
        }
    };

    const handleDragStart = (idx: number) => setDraggedImageIndex(idx);
    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (draggedImageIndex === null || draggedImageIndex === idx) return;
        const newImages = [...editForm.images];
        const dragged = newImages[draggedImageIndex];
        newImages.splice(draggedImageIndex, 1);
        newImages.splice(idx, 0, dragged);
        setEditForm(prev => ({ ...prev, images: newImages }));
        setDraggedImageIndex(idx);
    };
    const handleDragEnd = () => setDraggedImageIndex(null);

    const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setNewImageFiles(prev => [...prev, ...files]);
            setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        }
    };

    const toggleAmenity = (amenity: string) => {
        setEditForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    // Calendar helpers
    const getCalendarDays = () => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay();
        const days: (Date | null)[] = [];
        for (let i = 0; i < startPadding; i++) days.push(null);
        for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
        return days;
    };

    const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

    const toggleDateSelection = (date: Date) => {
        const key = formatDateKey(date);
        setSelectedDates(prev => prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]);
    };

    const applyHoursToSelected = async () => {
        if (!venue || selectedDates.length === 0) return;
        setIsSaving(true);
        try {
            // For each selected date, update availability
            const newBlockedDates = selectedDates.map(date => ({
                date,
                startTime: hoursForm.startTime,
                endTime: hoursForm.endTime,
                reason: hoursForm.isAvailable ? '' : 'Busy',
            }));

            // merge with existing
            const existing = venue.blockedDates?.filter(b => !selectedDates.includes(b.date)) || [];
            await venuesApi.update(venue._id, {
                blockedDates: [...existing, ...newBlockedDates],
            });

            setSelectedDates([]);
            fetchVenue(venue._id);
        } catch (err) {
            setError('Failed to update availability');
        } finally {
            setIsSaving(false);
        }
    };

    const prevMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
    const nextMonth = () => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));

    const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    if (authLoading || isLoading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
                </div>
            </DashboardLayout>
        );
    }

    if (!venue) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-2">Venue not found</h1>
                        <Button onClick={() => router.push('/dashboard/venues')}>Back to Venues</Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const displayImages = isEditMode ? editForm.images : venue.images;

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                {/* Header with Edit Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => router.push('/dashboard/venues')} className="flex items-center gap-2 text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Venues
                    </button>
                    <div className="flex gap-3">
                        {isEditMode ? (
                            <>
                                <Button variant="ghost" onClick={() => { setIsEditMode(false); initEditForm(venue); }}>Cancel</Button>
                                <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditMode(true)}>Edit Venue</Button>
                        )}
                    </div>
                </div>

                {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">{error}</div>}

                {/* Image Gallery */}
                <div className="mb-8">
                    <div className="relative h-[400px] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-violet-500/20 to-pink-500/20">
                        {displayImages && displayImages.length > 0 ? (
                            <img src={displayImages[selectedImage] || displayImages[0]} alt={venue.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {displayImages?.map((image, idx) => (
                            <div
                                key={idx}
                                draggable={isEditMode}
                                onDragStart={() => isEditMode && handleDragStart(idx)}
                                onDragOver={(e) => isEditMode && handleDragOver(e, idx)}
                                onDragEnd={handleDragEnd}
                                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === idx ? 'border-violet-500' : 'border-transparent opacity-60 hover:opacity-100'
                                    } ${isEditMode ? 'cursor-move' : ''} ${draggedImageIndex === idx ? 'opacity-50 scale-95' : ''}`}
                                onClick={() => setSelectedImage(idx)}
                            >
                                <img src={image} alt="" className="w-full h-full object-cover" />
                                {isEditMode && (
                                    <>
                                        <div className="absolute top-1 left-1 w-5 h-5 bg-black/70 rounded text-white text-xs flex items-center justify-center">{idx + 1}</div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(image); }}
                                            disabled={deletingImage === image}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white"
                                        >
                                            {deletingImage === image ? <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" /> : '×'}
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                        {/* New image previews */}
                        {isEditMode && imagePreviews.map((preview, idx) => (
                            <div key={`new-${idx}`} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-dashed border-violet-500/50">
                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => { setNewImageFiles(prev => prev.filter((_, i) => i !== idx)); setImagePreviews(prev => prev.filter((_, i) => i !== idx)); }}
                                    className="absolute top-1 right-1 w-5 h-5 bg-gray-800/80 rounded-full text-white text-xs"
                                >×</button>
                            </div>
                        ))}
                        {isEditMode && (
                            <label className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-violet-500/50">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <input type="file" accept="image/*" multiple onChange={handleImageAdd} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Name & Location */}
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                            {isEditMode ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Venue Name</label>
                                        <Input value={editForm.name} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} className="text-xl font-bold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Street</label>
                                            <Input value={editForm.street} onChange={(e) => setEditForm(prev => ({ ...prev, street: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">City</label>
                                            <Input value={editForm.city} onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">State</label>
                                            <Input value={editForm.state} onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Pincode</label>
                                            <Input value={editForm.pincode} onChange={(e) => setEditForm(prev => ({ ...prev, pincode: e.target.value }))} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-white mb-3">{venue.name}</h1>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span>{venue.address.street}, {venue.address.city}, {venue.address.state}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">About this venue</h2>
                            {isEditMode ? (
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
                                />
                            ) : (
                                <p className="text-gray-400 leading-relaxed whitespace-pre-line">{venue.description}</p>
                            )}
                        </div>

                        {/* Amenities */}
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Amenities</h2>
                            {isEditMode ? (
                                <div className="flex flex-wrap gap-2">
                                    {COMMON_AMENITIES.map((amenity) => (
                                        <button
                                            key={amenity}
                                            onClick={() => toggleAmenity(amenity)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${editForm.amenities.includes(amenity)
                                                    ? 'bg-violet-500/30 text-violet-300 border border-violet-500/50'
                                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {amenity}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {venue.amenities?.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-gray-300">
                                            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Availability Calendar */}
                        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-2">Availability Calendar</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                {isEditMode ? 'Click dates to select, then set hours for all selected dates.' : 'View your venue availability.'}
                            </p>

                            {/* Month Navigation */}
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <span className="text-white font-medium">
                                    {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Week Headers */}
                            <div className="grid grid-cols-7 gap-1 mb-1">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                    <div key={i} className="text-center text-xs text-gray-500 py-1">{d}</div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {getCalendarDays().map((date, i) => {
                                    if (!date) return <div key={i} className="aspect-square" />;
                                    const key = formatDateKey(date);
                                    const isSelected = selectedDates.includes(key);
                                    const isToday = date.toDateString() === new Date().toDateString();
                                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                    const blockedEntry = venue.blockedDates?.find(b => b.date === key);

                                    return (
                                        <button
                                            key={i}
                                            disabled={!isEditMode || isPast}
                                            onClick={() => isEditMode && !isPast && toggleDateSelection(date)}
                                            className={`aspect-square rounded-lg text-sm font-medium transition-all ${isPast ? 'text-gray-600 cursor-not-allowed' :
                                                    isSelected ? 'bg-violet-500 text-white ring-2 ring-violet-400' :
                                                        blockedEntry ? 'bg-red-500/30 text-red-400 border border-red-500/50' :
                                                            isToday ? 'bg-white/10 text-white' :
                                                                'text-gray-300 hover:bg-white/10'
                                                }`}
                                        >
                                            {date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Selected Dates Hours Form */}
                            {isEditMode && selectedDates.length > 0 && (
                                <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                                    <p className="text-sm text-violet-300 mb-3">{selectedDates.length} date(s) selected</p>
                                    <div className="flex items-center gap-2 mb-3">
                                        <input
                                            type="time"
                                            value={hoursForm.startTime}
                                            onChange={(e) => setHoursForm(prev => ({ ...prev, startTime: e.target.value }))}
                                            className="flex-1 px-2 py-1.5 bg-black/40 border border-white/10 rounded text-white text-sm"
                                        />
                                        <span className="text-gray-500">to</span>
                                        <input
                                            type="time"
                                            value={hoursForm.endTime}
                                            onChange={(e) => setHoursForm(prev => ({ ...prev, endTime: e.target.value }))}
                                            className="flex-1 px-2 py-1.5 bg-black/40 border border-white/10 rounded text-white text-sm"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 mb-3">
                                        <input
                                            type="checkbox"
                                            checked={hoursForm.isAvailable}
                                            onChange={(e) => setHoursForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                                            className="w-4 h-4 rounded"
                                        />
                                        <span className="text-sm text-gray-300">Available for booking</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => setSelectedDates([])}>Clear Selection</Button>
                                        <Button size="sm" onClick={applyHoursToSelected} disabled={isSaving}>
                                            {isSaving ? 'Applying...' : 'Apply to Selected'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Venue Stats */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
                            {/* Price */}
                            <div className="mb-6">
                                {isEditMode ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Base Price (₹)</label>
                                            <Input type="number" value={editForm.basePrice} onChange={(e) => setEditForm(prev => ({ ...prev, basePrice: Number(e.target.value) }))} />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Price per Hour (₹)</label>
                                            <Input type="number" value={editForm.pricePerHour} onChange={(e) => setEditForm(prev => ({ ...prev, pricePerHour: Number(e.target.value) }))} />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-white">{formatPrice(venue.pricing.basePrice)}</span>
                                            <span className="text-gray-400">base</span>
                                        </div>
                                        {venue.pricing.pricePerHour && (
                                            <p className="text-sm text-gray-500 mt-1">+ {formatPrice(venue.pricing.pricePerHour)} / hour</p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Capacity */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                                {isEditMode ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Min Capacity</label>
                                            <Input type="number" value={editForm.capacityMin} onChange={(e) => setEditForm(prev => ({ ...prev, capacityMin: Number(e.target.value) }))} />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Max Capacity</label>
                                            <Input type="number" value={editForm.capacityMax} onChange={(e) => setEditForm(prev => ({ ...prev, capacityMax: Number(e.target.value) }))} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Capacity</span>
                                        <span className="text-white">{venue.capacity.min} - {venue.capacity.max} guests</span>
                                    </div>
                                )}

                                {venue.rating.count > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Rating</span>
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-white">{venue.rating.average.toFixed(1)}</span>
                                            <span className="text-gray-500">({venue.rating.count})</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Status</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${venue.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {venue.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PartyBackground from '@/components/PartyBackground';
import VenueCard from '@/components/VenueCard';
import { VenueCardSkeleton, Input, Button } from '@/components/ui';
import { venuesApi } from '@/lib/api';
import { Venue } from '@/lib/types';

const cities = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
const capacityRanges = [
    { label: 'Any', min: 0, max: 10000 },
    { label: 'Up to 50', min: 0, max: 50 },
    { label: '50-100', min: 50, max: 100 },
    { label: '100-300', min: 100, max: 300 },
    { label: '300+', min: 300, max: 10000 },
];

export default function VenuesPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');
    const [selectedCapacity, setSelectedCapacity] = useState(capacityRanges[0]);

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            setIsLoading(true);
            const data = await venuesApi.getAll({ status: 'approved' });
            setVenues(data as Venue[]);
        } catch (error) {
            console.error('Failed to fetch venues:', error);
            // Use mock data for demo
            setVenues(getMockVenues());
        } finally {
            setIsLoading(false);
        }
    };

    const filteredVenues = venues.filter((venue) => {
        const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = selectedCity === 'All' || venue.address.city === selectedCity;
        const matchesCapacity = venue.capacity.max >= selectedCapacity.min &&
            venue.capacity.max <= selectedCapacity.max;
        return matchesSearch && matchesCity && matchesCapacity;
    });

    return (
        <>
            <PartyBackground />
            <Navbar />

            <main className="relative z-20 min-h-screen pt-28 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Discover Amazing <span className="text-violet-400">Venues</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Find the perfect space for your next event. From intimate gatherings to grand celebrations.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <Input
                                    placeholder="Search venues by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    leftIcon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    }
                                />
                            </div>

                            {/* City Filter */}
                            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                                {cities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => setSelectedCity(city)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCity === city
                                            ? 'bg-white text-black'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Capacity Filter */}
                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-sm text-gray-400">Capacity:</span>
                            <div className="flex gap-2">
                                {capacityRanges.map((range) => (
                                    <button
                                        key={range.label}
                                        onClick={() => setSelectedCapacity(range)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCapacity.label === range.label
                                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                            : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-400">
                            {isLoading ? 'Loading...' : `${filteredVenues.length} venues found`}
                        </p>
                        <Button variant="secondary" size="sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Near Me
                        </Button>
                    </div>

                    {/* Venues Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <VenueCardSkeleton key={i} />
                            ))
                        ) : filteredVenues.length > 0 ? (
                            filteredVenues.map((venue) => (
                                <VenueCard key={venue._id} venue={venue} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                                </svg>
                                <h3 className="text-xl font-semibold text-white mb-2">No venues found</h3>
                                <p className="text-gray-400">Try adjusting your filters or search query</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}

// Mock data for demo purposes
function getMockVenues(): Venue[] {
    return [
        {
            _id: '1',
            owner: 'owner1',
            name: 'The Grand Ballroom',
            description: 'An elegant venue perfect for weddings and corporate events.',
            images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
            videos: [],
            capacity: { min: 50, max: 500 },
            pricing: { basePrice: 50000, pricePerHour: 5000, currency: 'INR' },
            amenities: ['Parking', 'Catering', 'Sound System', 'Lighting', 'AC'],
            rules: [],
            location: { type: 'Point', coordinates: [72.8777, 19.0760] },
            address: { street: 'Marine Drive', city: 'Mumbai', state: 'Maharashtra', pincode: '400002', country: 'India' },
            availability: [],
            blockedDates: [],
            status: 'approved',
            rating: { average: 4.8, count: 124 },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '2',
            owner: 'owner2',
            name: 'Skyline Terrace',
            description: 'Stunning rooftop venue with panoramic city views.',
            images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
            videos: [],
            capacity: { min: 20, max: 150 },
            pricing: { basePrice: 35000, pricePerHour: 4000, currency: 'INR' },
            amenities: ['Open Air', 'Bar', 'DJ Setup', 'Valet Parking'],
            rules: [],
            location: { type: 'Point', coordinates: [77.5946, 12.9716] },
            address: { street: 'MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', country: 'India' },
            availability: [],
            blockedDates: [],
            status: 'approved',
            rating: { average: 4.6, count: 87 },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '3',
            owner: 'owner3',
            name: 'Heritage Villa',
            description: 'A beautiful heritage property with colonial architecture.',
            images: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800'],
            videos: [],
            capacity: { min: 100, max: 400 },
            pricing: { basePrice: 75000, pricePerHour: 8000, currency: 'INR' },
            amenities: ['Garden', 'Pool', 'Accommodation', 'Catering', 'Parking'],
            rules: [],
            location: { type: 'Point', coordinates: [77.2090, 28.6139] },
            address: { street: 'Chanakyapuri', city: 'Delhi', state: 'Delhi', pincode: '110021', country: 'India' },
            availability: [],
            blockedDates: [],
            status: 'approved',
            rating: { average: 4.9, count: 203 },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '4',
            owner: 'owner4',
            name: 'The Loft Studio',
            description: 'A modern industrial-style venue for creative events.',
            images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'],
            videos: [],
            capacity: { min: 10, max: 80 },
            pricing: { basePrice: 15000, pricePerHour: 2000, currency: 'INR' },
            amenities: ['WiFi', 'Projector', 'Sound System', 'Kitchen'],
            rules: [],
            location: { type: 'Point', coordinates: [73.8567, 18.5204] },
            address: { street: 'Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001', country: 'India' },
            availability: [],
            blockedDates: [],
            status: 'approved',
            rating: { average: 4.5, count: 56 },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '5',
            owner: 'owner5',
            name: 'Beach Resort Pavilion',
            description: 'Beachside venue with ocean views and sunset ambiance.',
            images: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800'],
            videos: [],
            capacity: { min: 50, max: 250 },
            pricing: { basePrice: 60000, pricePerHour: 6000, currency: 'INR' },
            amenities: ['Beach Access', 'Bar', 'Catering', 'Accommodation', 'Live Music'],
            rules: [],
            location: { type: 'Point', coordinates: [80.2707, 13.0827] },
            address: { street: 'ECR', city: 'Chennai', state: 'Tamil Nadu', pincode: '600041', country: 'India' },
            availability: [],
            blockedDates: [],
            status: 'approved',
            rating: { average: 4.7, count: 132 },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            _id: '6',
            owner: 'owner6',
            name: 'Garden Marquee',
            description: 'Lush outdoor venue with beautiful landscaped gardens.',
            images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
            videos: [],
            capacity: { min: 100, max: 600 },
            pricing: { basePrice: 80000, pricePerHour: 10000, currency: 'INR' },
            amenities: ['Garden', 'Marquee', 'Catering', 'Decor', 'Parking'],
            rules: [],
            location: { type: 'Point', coordinates: [78.4867, 17.3850] },
            address: { street: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', country: 'India' },
            availability: [],
            blockedDates: [],
            status: 'approved',
            rating: { average: 4.8, count: 167 },
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];
}

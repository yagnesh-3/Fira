import Link from 'next/link';
import { Venue } from '@/lib/types';

interface VenueCardProps {
    venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link href={`/venues/${venue._id}`}>
            <div className="group bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.08] hover:scale-[1.02]">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    {venue.images && venue.images.length > 0 ? (
                        <img
                            src={venue.images[0]}
                            alt={venue.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    )}

                    {/* Status Badge */}
                    {venue.status === 'approved' && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium">
                            Verified
                        </div>
                    )}

                    {/* Rating */}
                    {venue.rating.count > 0 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {venue.rating.average.toFixed(1)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                            {venue.name}
                        </h3>
                        <span className="text-violet-400 font-semibold text-sm">
                            {formatPrice(venue.pricing.basePrice)}
                        </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-1">{venue.address.city}, {venue.address.state}</span>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Up to {venue.capacity.max} guests</span>
                    </div>

                    {/* Amenities */}
                    {venue.amenities && venue.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {venue.amenities.slice(0, 3).map((amenity, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs"
                                >
                                    {amenity}
                                </span>
                            ))}
                            {venue.amenities.length > 3 && (
                                <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-xs">
                                    +{venue.amenities.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className = '',
    variant = 'text',
    width,
    height,
}: SkeletonProps) {
    const baseStyles = 'animate-pulse bg-white/5';

    const variants = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '100px'),
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={style}
        />
    );
}

// Pre-built skeleton patterns
export function CardSkeleton() {
    return (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
            <Skeleton variant="rectangular" height={200} className="mb-4" />
            <Skeleton variant="text" width="60%" height={24} className="mb-2" />
            <Skeleton variant="text" width="100%" height={16} className="mb-1" />
            <Skeleton variant="text" width="80%" height={16} className="mb-4" />
            <div className="flex gap-2">
                <Skeleton variant="text" width={80} height={32} className="rounded-full" />
                <Skeleton variant="text" width={80} height={32} className="rounded-full" />
            </div>
        </div>
    );
}

export function EventCardSkeleton() {
    return (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden">
            <Skeleton variant="rectangular" height={180} />
            <div className="p-5">
                <Skeleton variant="text" width="70%" height={20} className="mb-2" />
                <Skeleton variant="text" width="50%" height={16} className="mb-4" />
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="text" width="40%" height={14} />
                </div>
                <div className="flex justify-between">
                    <Skeleton variant="text" width={60} height={24} />
                    <Skeleton variant="text" width={100} height={36} className="rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function VenueCardSkeleton() {
    return (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden">
            <Skeleton variant="rectangular" height={200} />
            <div className="p-5">
                <div className="flex justify-between mb-2">
                    <Skeleton variant="text" width="60%" height={22} />
                    <Skeleton variant="text" width={60} height={22} />
                </div>
                <Skeleton variant="text" width="80%" height={14} className="mb-3" />
                <div className="flex gap-2 mb-4">
                    <Skeleton variant="text" width={70} height={24} className="rounded-full" />
                    <Skeleton variant="text" width={70} height={24} className="rounded-full" />
                </div>
                <Skeleton variant="text" width="100%" height={44} className="rounded-full" />
            </div>
        </div>
    );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="border-b border-white/5">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton variant="text" height={16} width={i === 0 ? '80%' : '60%'} />
                </td>
            ))}
        </tr>
    );
}

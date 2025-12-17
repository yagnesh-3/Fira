const Venue = require('../models/Venue');

const venueService = {
    // Get all venues
    async getAllVenues(query = {}) {
        const { page = 1, limit = 10, status, city } = query;
        const filter = {};
        if (status) filter.status = status;
        if (city) filter['address.city'] = new RegExp(city, 'i');

        const venues = await Venue.find(filter)
            .populate('owner', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Venue.countDocuments(filter);

        return {
            venues,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    },

    // Get nearby venues
    async getNearbyVenues(lat, lng, radius = 10000) {
        const venues = await Venue.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            },
            status: 'approved',
            isActive: true
        }).populate('owner', 'name email');

        return venues;
    },

    // Get venue by ID
    async getVenueById(id) {
        const venue = await Venue.findById(id).populate('owner', 'name email avatar');
        if (!venue) {
            throw new Error('Venue not found');
        }
        return venue;
    },

    // Create venue
    async createVenue(data) {
        const venue = await Venue.create(data);
        return venue;
    },

    // Update venue
    async updateVenue(id, updateData) {
        const venue = await Venue.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );
        if (!venue) {
            throw new Error('Venue not found');
        }
        return venue;
    },

    // Delete venue
    async deleteVenue(id) {
        const venue = await Venue.findByIdAndDelete(id);
        if (!venue) {
            throw new Error('Venue not found');
        }
        return { message: 'Venue deleted successfully' };
    },

    // Update availability
    async updateAvailability(id, availability) {
        const venue = await Venue.findByIdAndUpdate(
            id,
            { $set: { availability } },
            { new: true }
        );
        if (!venue) {
            throw new Error('Venue not found');
        }
        return venue;
    },

    // Update status (admin)
    async updateStatus(id, status) {
        const venue = await Venue.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        );
        if (!venue) {
            throw new Error('Venue not found');
        }
        return venue;
    }
};

module.exports = venueService;

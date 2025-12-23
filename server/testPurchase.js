const mongoose = require('mongoose');
require('dotenv').config();
const ticketService = require('./services/ticketService');
const User = require('./models/User');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        // 1. Get User
        const user = await User.findOne({ email: 'test_neonhorizon@example.com' });
        if (!user) throw new Error('User not found');
        console.log('User:', user._id);

        // 2. Get Event
        const event = await Event.findOne({ name: 'Neon Nights Festival' });
        if (!event) throw new Error('Event not found');
        console.log('Event:', event.name, event._id);
        console.log('  Type:', event.ticketType);
        console.log('  Price:', event.ticketPrice);

        // 3. Attempt Purchase (No Payment ID)
        console.log('Attempting purchase without paymentId...');
        const result = await ticketService.purchaseTicket({
            userId: user._id,
            eventId: event._id,
            quantity: 1,
            ticketType: 'general'
        });

        console.log('Purchase Result:', JSON.stringify(result, null, 2));

        if (result.paymentRequired) {
            console.log('✅ PASS: Payment was required.');
        } else {
            console.log('❌ FAIL: Payment was SKIPPED.');
        }
        
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });

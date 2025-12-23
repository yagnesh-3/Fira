const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('./models/Event');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        // Find a specific paid event
        const event = await Event.findOne({ name: 'Neon Nights Festival' });
        
        if (event) {
            console.log('Event Found:');
            console.log('Name:', event.name);
            console.log('Ticket Type:', event.ticketType);
            console.log('Ticket Price:', event.ticketPrice);
            console.log('Ticket Price Type:', typeof event.ticketPrice);
            console.log('Is Paid?', event.ticketType === 'paid');
            console.log('Has Price?', event.ticketPrice > 0);
        } else {
            console.log('Event "Neon Nights Festival" not found.');
        }
        
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

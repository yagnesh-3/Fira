const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('./models/Event');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        const events = await Event.find({ name: 'Neon Nights Festival' });
        console.log(`Found ${events.length} events with name "Neon Nights Festival"`);
        
        events.forEach(e => {
            console.log(`- ID: ${e._id}, Type: ${e.ticketType}, Price: ${e.ticketPrice}`);
        });

        if (events.length > 1) {
             console.log('⚠ DUPLICATES FOUND! This explains why data might be inconsistent.');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

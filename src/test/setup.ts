require('dotenv').config({ path: '.env.test' });

import mongoose from 'mongoose';
import { redisClient } from '../controllers/users';


afterAll(async () => {
    await mongoose.disconnect();
    await redisClient.quit();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
}); 
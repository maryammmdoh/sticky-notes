
import { connect } from 'mongoose';
import { DB_URL } from '../../config/config.service.js';

async function connectDB() {
    try {
        await connect(DB_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectDB;
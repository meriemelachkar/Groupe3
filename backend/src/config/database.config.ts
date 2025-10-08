import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/buildwealth',
}));

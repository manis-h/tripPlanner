// backend/src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { connectToDatabase } from './models/db';
import { tripRoutes } from './routes/Trips';

const fastify = Fastify({
  logger: true
});

fastify.register(cors, {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

fastify.register(tripRoutes, { prefix: '/api/trips' });

const start = async () => {
  try {
    await connectToDatabase();
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on port 3001');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
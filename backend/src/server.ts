import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import dotenv from 'dotenv';
import process from 'process';

// Routes
import { authRoutes } from './routes/auth';
import { aiRoutes } from './routes/ai';
import { mealRoutes } from './routes/meals';
import { workoutRoutes } from './routes/workouts';
import { progressRoutes } from './routes/progress';
import { profileRoutes } from './routes/profile';
import { testRoutes } from './routes/test';

dotenv.config();

const server = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
  connectionTimeout: 60000, // 60s timeout for AI generation
});

// Zod Validation Setup
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Middleware / Plugins
server.register(cors, {
  origin: '*',
});
server.register(helmet);
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});
server.register(multipart);

// Register Routes
server.register(authRoutes, { prefix: '/api/auth' });
server.register(aiRoutes, { prefix: '/api/ai' });
server.register(mealRoutes, { prefix: '/api/meals' });
server.register(workoutRoutes, { prefix: '/api/workouts' });
server.register(progressRoutes, { prefix: '/api/progress' });
server.register(profileRoutes, { prefix: '/api/profile' });
server.register(testRoutes, { prefix: '/api' });

// Global Error Handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  // Cast error to any to access custom properties if needed
  const err = error as any;
  reply.status(err.statusCode || 500).send({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

const start = async () => {
  try {
    const PORT = parseInt(process.env.PORT || '3001');
    const HOST = '0.0.0.0'; // Listen on all interfaces
    const address = await server.listen({ port: PORT, host: HOST });
    console.log(`🚀 NutriStrong Backend running on ${address}`);
    console.log(`👉 API available at http://localhost:${PORT}/api`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
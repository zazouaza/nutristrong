import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { verifyAuth, AuthenticatedRequest } from '../middleware/auth';

export async function authRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Register
  server.post(
    '/register',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) return reply.status(400).send({ success: false, error: error.message });
      return reply.send({ success: true, data });
    }
  );

  // Login
  server.post(
    '/login',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) return reply.status(401).send({ success: false, error: error.message });
      return reply.send({ success: true, data });
    }
  );

  // Get Current User (Protected)
  server.get(
    '/me',
    {
      preHandler: [verifyAuth],
    },
    async (request, reply) => {
      const user = (request as AuthenticatedRequest).user;
      return reply.send({ success: true, user });
    }
  );
}
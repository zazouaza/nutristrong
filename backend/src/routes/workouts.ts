import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { verifyAuth, AuthenticatedRequest } from '../middleware/auth';

export async function workoutRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Save a workout
  server.post(
    '/save',
    {
      preHandler: [verifyAuth],
      schema: {
        body: z.object({
          day: z.string(),
          focus: z.string(),
          exercises: z.array(z.any()),
        }),
      },
    },
    async (request, reply) => {
      const { user } = request as AuthenticatedRequest;
      const { day, focus, exercises } = request.body;

      const { data, error } = await supabase
        .from('workouts')
        .upsert({ user_id: user.id, day, focus, exercises })
        .select()
        .single();

      if (error) return reply.status(500).send({ success: false, error: error.message });
      return reply.send({ success: true, data });
    }
  );

  // Get full week
  server.get(
    '/week',
    {
      preHandler: [verifyAuth],
    },
    async (request, reply) => {
      const { user } = request as AuthenticatedRequest;

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id);

      if (error) return reply.status(500).send({ success: false, error: error.message });
      return reply.send({ success: true, data });
    }
  );
}
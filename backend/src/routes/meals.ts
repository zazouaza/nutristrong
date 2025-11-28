import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { verifyAuth, AuthenticatedRequest } from '../middleware/auth';

export async function mealRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Save a meal plan
  server.post(
    '/save',
    {
      preHandler: [verifyAuth],
      schema: {
        body: z.object({
          day: z.string(), // e.g., 'Monday' or ISO date
          meals: z.any(), // JSON blob of the meals
        }),
      },
    },
    async (request, reply) => {
      const { user } = request as AuthenticatedRequest;
      const { day, meals } = request.body;

      const { data, error } = await supabase
        .from('meal_plans')
        .upsert({ user_id: user.id, day, meals })
        .select()
        .single();

      if (error) return reply.status(500).send({ success: false, error: error.message });
      return reply.send({ success: true, data });
    }
  );

  // Get specific day
  server.get(
    '/:day',
    {
      preHandler: [verifyAuth],
      schema: {
        params: z.object({ day: z.string() }),
      },
    },
    async (request, reply) => {
      const { user } = request as AuthenticatedRequest;
      const { day } = request.params;

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('day', day)
        .single();

      if (error) return reply.status(404).send({ success: false, error: 'Meals not found for this day' });
      return reply.send({ success: true, data });
    }
  );
}
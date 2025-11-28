import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { verifyAuth, AuthenticatedRequest } from '../middleware/auth';

export async function profileRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Get Current User Profile
  server.get(
    '/me',
    {
      preHandler: [verifyAuth],
    },
    async (request, reply) => {
      const { user } = request as AuthenticatedRequest;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        return reply.status(404).send({ success: false, error: 'Profile not found' });
      }
      
      // Explicitly map snake_case DB fields to camelCase Frontend interface
      const mappedProfile = {
        age: data.age,
        gender: data.gender,
        heightCm: data.height, // DB: height -> Frontend: heightCm
        weightKg: data.weight, // DB: weight -> Frontend: weightKg
        goal: data.goal,
        activityLevel: data.activity_level, // DB: activity_level -> Frontend: activityLevel
        dietaryRestrictions: data.diet_preferences ? data.diet_preferences.join(', ') : '',
        allergies: data.allergies ? data.allergies.join(', ') : '',
        plan_json: data.plan_json
      };

      return reply.send({ success: true, data: mappedProfile });
    }
  );

  // Save full profile and initial plan with RELAXED validation
  server.post(
    '/save-plan',
    {
      preHandler: [verifyAuth],
      schema: {
        body: z.object({
          age: z.coerce.number().optional().default(0),
          gender: z.string().optional().default(''),
          heightCm: z.coerce.number().optional().default(0),
          weightKg: z.coerce.number().optional().default(0),
          goal: z.string().optional().default(''),
          activityLevel: z.string().optional().default(''),
          dietaryRestrictions: z.string().nullable().optional().default(''),
          allergies: z.string().nullable().optional().default(''),
          plan_json: z.any() // The generated plan object
        }),
      },
    },
    async (request, reply) => {
      const { user } = request as AuthenticatedRequest;
      const { plan_json, ...profileData } = request.body;

      try {
        const dbPayload = {
            id: user.id,
            age: profileData.age,
            gender: profileData.gender,
            height: profileData.heightCm, // Ensure we map back to 'height' column
            weight: profileData.weightKg, // Ensure we map back to 'weight' column
            goal: profileData.goal,
            activity_level: profileData.activityLevel,
            diet_preferences: profileData.dietaryRestrictions ? profileData.dietaryRestrictions.split(',').map(s => s.trim()) : [],
            allergies: profileData.allergies ? profileData.allergies.split(',').map(s => s.trim()) : [],
            plan_json: plan_json,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('profiles')
            .upsert(dbPayload)
            .select()
            .single();

        if (error) {
            request.log.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
        
        return reply.send({ success: true, data });
      } catch (e: any) {
        request.log.error(e);
        return reply.status(500).send({ success: false, error: e.message });
      }
    }
  );
}
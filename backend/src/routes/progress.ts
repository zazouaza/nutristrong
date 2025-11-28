import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { verifyAuth, AuthenticatedRequest } from '../middleware/auth';

export async function progressRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Log Weight
  server.post(
    '/weight',
    {
      preHandler: [verifyAuth],
      schema: {
        body: z.object({
          weight: z.number(),
          date: z.string().optional(), // ISO string
        }),
      },
    },
    async (request, reply) => {
      const { user } = request as AuthenticatedRequest;
      const { weight, date } = request.body;

      const { data, error } = await supabase
        .from('progress_logs')
        .insert({ 
          user_id: user.id, 
          weight, 
          date: date || new Date().toISOString(),
          type: 'weight'
        })
        .select();

      if (error) return reply.status(500).send({ success: false, error: error.message });
      return reply.send({ success: true, data });
    }
  );

  // Upload Photo (Multipart)
  server.post(
    '/photo',
    {
      preHandler: [verifyAuth],
    },
    async (request, reply) => {
      const { user } = request as AuthenticatedRequest;
      // Cast request to any to access .file() which is added by @fastify/multipart
      const data = await (request as any).file();

      if (!data) {
        return reply.status(400).send({ success: false, error: 'No file uploaded' });
      }

      const filename = `${user.id}/${Date.now()}_${data.filename}`;
      const buffer = await data.toBuffer();

      const { data: uploadData, error } = await supabase.storage
        .from('progress-photos')
        .upload(filename, buffer, {
          contentType: data.mimetype,
        });

      if (error) return reply.status(500).send({ success: false, error: error.message });
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('progress-photos')
        .getPublicUrl(filename);

      // Save reference to DB
      await supabase.from('progress_logs').insert({
        user_id: user.id,
        photo_url: publicUrl,
        type: 'photo',
        date: new Date().toISOString()
      });

      return reply.send({ success: true, url: publicUrl });
    }
  );
}
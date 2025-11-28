import { FastifyInstance } from 'fastify';
import { supabase } from '../lib/supabase';

export async function testRoutes(app: FastifyInstance) {
  app.get('/test-supa', async (request, reply) => {
    try {
      // Query the 'profiles' table as requested.
      // Note: If the table 'profiles' does not exist yet in your Supabase DB, 
      // Supabase will return an error, but it confirms the connection worked.
      const { data, error } = await supabase.from('profiles').select('*').limit(1);

      if (error) {
        request.log.error(error);
        return reply.status(500).send({ 
          success: false, 
          message: 'Connected to Supabase, but query failed (Table likely missing)',
          error: error.message 
        });
      }

      return reply.send({ success: true, data, message: 'Supabase Connection Successful' });
    } catch (err: any) {
      request.log.error(err);
      return reply.status(500).send({ 
        success: false, 
        message: 'Critical Connection Failure',
        error: err.message 
      });
    }
  });
}
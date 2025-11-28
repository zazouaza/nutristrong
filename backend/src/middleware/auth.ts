import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../lib/supabase';

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string;
    email?: string;
  };
}

export const verifyAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ success: false, error: 'Missing Authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return reply.status(401).send({ success: false, error: 'Invalid or expired token' });
  }

  // Attach user to request for downstream use
  (request as AuthenticatedRequest).user = {
    id: user.id,
    email: user.email
  };
};
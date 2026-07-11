import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';

import animepahe from './animepahe';
import animekai from './animekai';
import hianime from './hianime';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(animepahe, { prefix: '/animepahe' });
  await fastify.register(animekai, { prefix: '/animekai' });
  await fastify.register(hianime, { prefix: '/hianime' });

  fastify.get('/', async (_request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Anime 🗾');
  });

  fastify.get('/:animeProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    const provider = decodeURIComponent(
      (request.params as { animeProvider: string }).animeProvider,
    );
    const allowed = ['animepahe', 'animekai', 'hianime'];
    if (allowed.includes(provider)) {
      return reply.redirect(`/anime/${provider}`);
    }
    return reply.status(404).send({
      message: 'Provider not found. Use: animepahe, animekai, hianime',
    });
  });
};

export default routes;

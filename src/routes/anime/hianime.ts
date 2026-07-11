import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const hianime = new ANIME.Hianime();

  fastify.get('/', (_, rp) => {
    rp.status(200).send({
      intro: 'Welcome to the hianime provider @ https://hianime.to',
      routes: ['/:query', '/info', '/watch/:episodeId'],
    });
  });

  fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as { page: number }).page;
    try {
      const res = await hianime.search(query, page);
      reply.status(200).send(res);
    } catch {
      reply.status(500).send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/info', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.query as { id: string }).id;
    try {
      const res = await hianime.fetchAnimeInfo(id);
      reply.status(200).send(res);
    } catch {
      reply.status(500).send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });

  fastify.get('/watch/:episodeId', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = (request.params as { episodeId: string }).episodeId;
    const server = (request.query as { server?: StreamingServers }).server;
    try {
      const res = await hianime.fetchEpisodeSources(episodeId, server);
      reply.status(200).send(res);
    } catch {
      reply.status(500).send({ message: 'Something went wrong. Contact developer for help.' });
    }
  });
};

export default routes;

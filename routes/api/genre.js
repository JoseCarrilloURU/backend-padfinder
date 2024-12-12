import server from '../../components/Server/index.js';
import GenreController from '../../controllers/genreController.js';

const genreRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/genre',
    routeConfigs: [
      { method: 'get', handlers: [GenreController.getGenres] },
      { method: 'post', handlers: [GenreController.createGenre] },
      { method: 'put', handlers: [GenreController.createGenre] },
      { method: 'delete', handlers: [GenreController.createGenre] },
    ],
  });

  return router;
};

export default genreRouter;

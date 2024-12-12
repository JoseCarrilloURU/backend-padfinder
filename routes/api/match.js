import server from '../../components/Server/index.js';
import MatchController from '../../controllers/matchController.js';

const matchRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/match',
    routeConfigs: [
      { method: 'get', handlers: [MatchController.getMatch] },
      { method: 'post', handlers: [MatchController.addMatch] },
      { method: 'put', handlers: [MatchController.updateMatch] },
      { method: 'delete', handlers: [MatchController.deleteMatch] },
    ],
  });

  return router;
};

export default matchRouter;

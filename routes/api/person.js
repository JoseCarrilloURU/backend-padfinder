import server from '../../components/Server/index.js';
import PersonController from '../../controllers/personController.js';

const personRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/person',
    routeConfigs: [
      { method: 'get', handlers: [PersonController.getPersons] },
      { method: 'put', handlers: [PersonController.updatePerson] },
    ],
  });

  return router;
};

export default personRouter;

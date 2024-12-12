import server from '../../components/Server/index.js';
import PersonCourtController from '../../controllers/personCourtController.js';

const personCourtRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/person-court',
    routeConfigs: [
      { method: 'post', handlers: [PersonCourtController.addCourtToPerson] },
      {
        method: 'delete',
        handlers: [PersonCourtController.removeCourtFromPerson],
      },
      {
        method: 'get',
        subPath: '/court',
        handlers: [PersonCourtController.getCourtsByPerson],
      },
      {
        method: 'get',
        subPath: '/person',
        handlers: [PersonCourtController.getPersonsByCourt],
      },
    ],
  });

  return router;
};

export default personCourtRouter;

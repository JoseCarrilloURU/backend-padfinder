import server from '../../components/Server/index.js';
import CourtController from '../../controllers/courtController.js';
import { upload } from '../../utils/storage.js';

const courtRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/court',
    routeConfigs: [
      { method: 'get', handlers: [CourtController.getCourts] },
      {
        method: 'post',
        handlers: [upload.single('image'), CourtController.createCourt],
      },
      {
        method: 'put',
        handlers: [upload.single('image'), CourtController.updateCourt],
      },
      {
        method: 'get',
        subPath: '/image',
        handlers: [CourtController.getImage],
      },
    ],
  });

  return router;
};

export default courtRouter;

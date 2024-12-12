import server from '../../components/Server/index.js';
import RegisterController from '../../controllers/registerController.js';
import { upload } from '../../utils/storage.js';

const registerRouter = () => {
  const router = server.createRouterInstance();

  server.registerRouteWithMethod({
    router,
    method: 'post',
    path: '/register',
    handler: [upload.single('image'), RegisterController.register],
  });

  return router;
};

export default registerRouter;

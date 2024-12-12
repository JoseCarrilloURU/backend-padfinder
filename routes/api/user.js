import server from '../../components/Server/index.js';
import UserController from '../../controllers/userController.js';
import { upload } from '../../utils/storage.js';

const userRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/user',
    routeConfigs: [
      { method: 'get', handlers: [UserController.getUsers] },
      {
        method: 'post',
        handlers: [upload.single('image'), UserController.createUser],
      },
      {
        method: 'put',
        handlers: [upload.single('image'), UserController.updateUser],
      },
      { method: 'delete', handlers: [UserController.deleteUser] },
      {
        method: 'get',
        subPath: '/image',
        handlers: [UserController.getUserImage],
      },
    ],
  });

  return router;
};

export default userRouter;

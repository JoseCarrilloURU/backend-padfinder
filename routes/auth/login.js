import LoginController from '../../controllers/loginController.js';
import server from '../../components/Server/index.js';

const loginRouter = () => {
  const router = server.createRouterInstance();

  server.registerRouteWithMethod({
    router,
    method: 'post',
    path: '/login',
    handler: [LoginController.login],
  });

  return router;
};

export default loginRouter;

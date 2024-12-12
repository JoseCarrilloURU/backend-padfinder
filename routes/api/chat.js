import server from '../../components/Server/index.js';
import ChatController from '../../controllers/chatController.js';

const chatRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/chat',
    routeConfigs: [
      { method: 'get', handlers: [ChatController.getChats] },
      { method: 'post', handlers: [ChatController.addChat] },
      { method: 'put', handlers: [ChatController.updateChat] },
      { method: 'delete', handlers: [ChatController.deleteChat] },
    ],
  });

  return router;
};

export default chatRouter;

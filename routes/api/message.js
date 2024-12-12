import server from '../../components/Server/index.js';
import upload from '../../utils/storageChat.js';
import MessageController from '../../controllers/messageController.js';

const messageRouter = () => {
  const router = server.createRouterInstance();

  server.registerMultipleMethods({
    router,
    basePath: '/message',
    routeConfigs: [
      { method: 'get', handlers: [MessageController.getMessageByChat] },
      {
        method: 'post',
        handlers: [upload, MessageController.handleChatMessage],
      },
      { method: 'put', handlers: [upload, MessageController.updateMessage] },
      { method: 'delete', handlers: [MessageController.deleteMessage] },
    ],
  });

  return router;
};

export default messageRouter;

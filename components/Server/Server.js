import express from 'express';

/**
 * Adapter class for Express server.
 */
class Server {
  app;
  port;

  /**
   * Creates an instance of ExpressAdapter.
   * @param {number} defaultPort - The default port number.
   */
  constructor({ defaultPort = 8080 }) {
    this.app = express();
    this.port = defaultPort;
  }

  /**
   * Starts the Express server.
   * @param {() => void} onStart - The callback function to be executed after the server starts.
   */
  startServer = (onStart) => {
    this.app.listen(this.port, onStart);
  };

  /**
   * Adds a route to the Express application with the provided router.
   *
   * @param {string} path - The route path.
   * @param {express.Router} router - The router for handling the route.
   */
  registerRoute = ({ path, router }) => {
    this.app.use(path, router);
  };

  /**
   * Sets a router middleware for the given path.
   *
   * @param {string} path - The route path.
   * @param {express.Router} baseRouter - The main router.
   * @param {express.Router} middlewareRouter - The router to be used as middleware.
   */
  useMiddlewareRouter = ({ path, baseRouter, middlewareRouter }) => {
    baseRouter.use(path, middlewareRouter);
  };

  /**
   * Registers multiple sub-routers under a given base router.
   *
   * @param {object} params - The configuration object.
   * @param {express.Router} params.baseRouter - The Express base router instance.
   * @param {string} params.basePath - The base path.
   * @param {Array<{ subPath?: string, router?: express.Router } | express.Router>} params.routerConfigs - The array of router configurations.
   */
  registerMultipleRouters = ({ basePath, baseRouter, routerConfigs }) => {
    routerConfigs.forEach((config) => {
      let subPath = '';
      let router;

      if (typeof config === 'function') {
        router = config;
      } else {
        subPath = config.subPath ?? '';
        router = config.router;
      }

      const finalPath = `${basePath}${subPath}`;
      this.useMiddlewareRouter({
        path: finalPath,
        baseRouter,
        middlewareRouter: router,
      });
    });
  };

  /**
   * Registers a route on the provided router with the specified HTTP method.
   *
   * @param {object} options - The options for setting the route.
   * @param {"get"|"post"|"delete"|"put"|"patch"} options.method - The HTTP method for the route (e.g., 'get', 'post', 'put', 'delete').
   * @param {express.Router} options.router - The Express router on which to set the route.
   * @param {string} options.path - The route path.
   * @param {express.RequestHandler} options.handler - The callback function to handle the route.
   */
  registerRouteWithMethod = ({ method, path, router, handler }) => {
    router[method](path, ...handler);
  };

  /**
   * Configures multiple routes and methods for a given router.
   *
   * @param {object} params - The configuration object.
   * @param {express.Router} params.router - The Express router instance.
   * @param {string} params.basePath - The base route path.
   * @param {Array<{ subPath?: string, method: string, handlers: Array<express.RequestHandler> }>} params.routeConfigs - The array of route configurations.
   */
  registerMultipleMethods = ({ router, basePath, routeConfigs }) => {
    routeConfigs.forEach(({ subPath, method, handlers }) => {
      const finalPath = `${basePath}${subPath ? subPath : ''}`;
      this.registerRouteWithMethod({
        method,
        path: finalPath,
        router,
        handler: handlers,
      });
    });
  };

  /**
   * Creates an instance of Express Router.
   * @returns {express.Router} - The Express Router instance.
   */
  createRouterInstance = () => {
    return express.Router();
  };

  /**
   * Adds a custom middleware to the Express app or a router.
   * @param {function} middleware - The middleware function to be added.
   * @param {express.Router} [router] - Optional router to add the middleware to.
   */
  addCustomMiddleware = ({ middleware, router = undefined }) => {
    !router ? this.app.use(middleware) : router.use(middleware);
  };

  /**
   * Adds JSON middleware to the Express server.
   * This middleware parses incoming requests with JSON payloads.
   * @param {Object<{limit: string, strict: boolean}>} config - Objeto de configuración para ajustar el tamaño de las solicitudes y si se debe usar JSON estricto
   */
  enableJsonMiddleware = (config) => {
    this.app.use(express.json(config));
  };

  /**
   * Adds URL-encoded middleware to the Express server.
   * This middleware parses incoming requests with URL-encoded payloads.
   * @param {Object<{limit: string, extended: boolean, parameterLimit: number}>} config - Objeto de configuración para ajustar el tamaño y cantidad de parámetros que se pueden pasar por la URL
   */
  enableUrlEncodedMiddleware = (config) => {
    this.app.use(express.urlencoded(config));
  };
}

export default Server;

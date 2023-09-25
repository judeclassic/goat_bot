import dotEnv from 'dotenv'
import cors from 'cors'
import server from './data/repository/server';
import DBConnection from './data/repository/database/connect';
import { useTelegramBot } from './features/telegram/telegram.routes';
import AuthorizationRepo from './data/repository/encryption';
import RequestHandler from './data/repository/server/router';
import integrationUserRoutes from './features/web/integration/integration.routes';
import { initLogger } from './data/repository/logger.ts';


dotEnv.config();
const dBConnection = new DBConnection();
dBConnection.connect();

export default server((app, _server) => {
    cors();
    useTelegramBot();

    const authenticationRepo = new AuthorizationRepo();
    const router = new RequestHandler({ router: app,  authenticationRepo, host: '/api' });

    router.extend('/integrations', integrationUserRoutes);
    if (process.env.NODE_ENV === 'development') initLogger.useExpressMonganMiddleWare(app);
    if (process.env.NODE_ENV === 'development') initLogger.checkRoutes(router);
});



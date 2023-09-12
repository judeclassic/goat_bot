import dotEnv from 'dotenv'
import cors from 'cors'
import server from './data/repository/server';
import DBConnection from './data/repository/database/connect';
import { useTelegramBot } from './features/telegram/telegram.routes';


dotEnv.config();
const dBConnection = new DBConnection();
dBConnection.connect();

export default server((_app, _server) => {
    cors();
    useTelegramBot();
});



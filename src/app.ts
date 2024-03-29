import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import { router } from './routes';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.disable('x-powered-by');
app.use(router);
app.use(express.static('public'));

export default app;

import express from 'express';
import path from 'path';
import routes from './routes'
import cors from 'cors';
import errorHandler from './errors/handler';

import 'express-async-errors';
import './database/connection';

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler)

app.listen(3333);
import express, { Application } from 'express';
import cors from 'cors';
import { APP_URL } from './config/env';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import errorHandler from './middleware/globalErrorHandler';
import { notFoundRoute } from './middleware/notFoundRoute';
import { providersRoutes } from './modules/providers/providers.routes';
import { userRoutes } from './modules/user/user.routes';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: APP_URL,
    credentials: true,
}));

app.get('/', (req, res) => {
    res.status(200).json("FoodHub API is running!");
});

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use('/api/user', userRoutes);
app.use('/api/providers', providersRoutes);


// if there is no matching route
app.use(notFoundRoute);
// global error handler
app.use(errorHandler);

export default app;
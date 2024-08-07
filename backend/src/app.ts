import 'dotenv/config';
import express  from "express";
import notesRoutes from './routes/notes'
import morgan from 'morgan';
import createHttpError, {isHttpError} from 'http-errors';

const app = express();

app.use(morgan('dev'));

app.use(express.json());


app.use("/api/notes", notesRoutes);

app.use((_req, _res, next) => {
    next(createHttpError(404, "Endpoint not Found"));
});

app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }

    res.status(statusCode).json({error: errorMessage });

})

  
export default app;
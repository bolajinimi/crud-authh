import app from './app';
import env from './utils/validateEnv';
import mongoose from 'mongoose';


const port = env.PORT;

mongoose.connect(env.MONGO_CONNECTION_STRING || '')
.then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log("server running on port: " + port);
  })
})
.catch((error) => {
    console.log("Error connecting to the database", error);
});

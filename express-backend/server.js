import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import studentSchema from './schemas/student.schema.js';
import adminSchema from './schemas/admin.schema.js';
import studentResolvers from './resolvers/student.resolvers.js';
import adminResolvers from './resolvers/admin.resolvers.js';
import authentication from './middleware/authentication.js';
import router from './routes/auth.routes.js'

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(logger('dev'));
app.use(cors({ origin: 'http://localhost:5173', credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', router);

//Used for trouble shooting
app.use('/student', (req, res, next) => {
  console.log('Received request at /graphql');
  console.log('Query:', req.body.query);
  console.log('Variables:', req.body.variables);
  console.log('token:', req.cookies.token);
  next();
});

app.use('/admin', authentication.verifyAdminToken, graphqlHTTP({
  schema: adminSchema, 
  rootValue: adminResolvers, 
  graphiql: true,
}));

app.use('/student', authentication.verifyToken, graphqlHTTP({
  schema: studentSchema, 
  rootValue: studentResolvers, 
  graphiql: true,
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
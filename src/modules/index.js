import userRoutes from './users/user.routes';
// import { authJwt } from '../services/auth.services'; // This is  to test our JWT
import postRoutes from './posts/post.routes';

export default app => {
  app.use('/api/v1/users', userRoutes);
  // This is to test the JWT taking us to a private route accessed by our JWT Authorization header
  // app.get('/hello', authJwt, (req, res) => {
  //   res.send('This is a private route!');
  // });
  app.use('/api/v1/posts', postRoutes);
};

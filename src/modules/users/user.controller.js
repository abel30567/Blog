import User from './user.model';

export async function signUp(req, res) {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (e) {
    return res.status(500).json(e);
  }
}

export function login(req, res, next) {
  res.status(200).json(req.user);
  // passport puts the user as a request, then we create a JWT token to send to the front

  return next();
}

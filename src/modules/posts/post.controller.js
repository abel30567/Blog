import HTTPStatus from 'http-status';

import Post from './post.model';

export async function createPost(req, res) {
  try {
    const post = await Post.createPost(req.body, req.user._id);
    // Method 1 of creating a post.
    // const post = await Post.create({ ...req.body, user: req.user._id });
    // The ...req.body states to create a post with everything the request brings with
    // And we can use req.user._id because of JWT
    // see post.model for method 2
    return res.status(HTTPStatus.CREATED).json(post);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate('user');
    return res.status(HTTPStatus.OK).json(post);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}
// See the list() function in model
export async function getPostList(req, res) {
  try {
    const posts = await Post.list({ limit: Number(req.query.limit), skip: Number(req.query.skip) });
    return res.status(HTTPStatus.OK).json(posts);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id); // the /:id route

    if (!post.user.equals(req.user._id)) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }
    // Object.keys gets the key values of an object like title & body
    // Object.values gets the values for the keys like title 1 & content of body
    Object.keys(req.body).forEach(key => {
      post[key] = req.body[key];
    });

    return res.status(HTTPStatus.OK).json(await post.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

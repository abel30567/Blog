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

import Joi from 'joi';

export default {
  createPost: {
    body: {
      title: Joi.string().min(3).required(),
      body: Joi.string().min(20).required(),
    },
  },
  updatePost: {
    body: {
      title: Joi.string().min(3),
      body: Joi.string().min(20), // no required because user might want to fix one and not the other.
    },
  },
};


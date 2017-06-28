import mongoose, { Schema } from 'mongoose';
import slug from 'slug'; // this is for the title of page like xxx.com/title
import uniqueValidator from 'mongoose-unique-validator'; // this library helps us validate uniqueness

const PostSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Title is required!'],
    minlength: [3, 'Title needs to be longer.'],
    unique: true,
  },
  body: {
    type: String,
    trim: true,
    required: [true, 'Body must be provided'],
    minlength: [20, 'Body needs to be longer'],
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

// Plugin

PostSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
});

// Running scripts

PostSchema.pre('validate', function (next) {
  this._slugify();

  next();
});

// Methods

PostSchema.methods = {
  _slugify() {
    this.slug = slug(this.title);
  },
  toJSON() {
    return {
      _id: this._id,
      createdAt: this.createdAt,
      slug: this.slug,
      title: this.title,
      body: this.body,
      user: this.user,
      favoriteCount: this.favoriteCount,
    };
  },
};

// Statics
// Method 2 of creating a post. create a function for it here

PostSchema.statics = {
  createPost(args, user) {
    return this.create({
      ...args,
      user,
    });
  },
  // The list function list() sorts out our data to be from most recent post,
  // doesn't skip a post, limits posts shown to 5, it shows which user created that post.
  list({ skip = 0, limit = 5 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user');
  },
};

export default mongoose.model('Post', PostSchema);

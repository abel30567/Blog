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
};

export default mongoose.model('Post', PostSchema);

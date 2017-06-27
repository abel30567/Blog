import mongoose, { Schema } from 'mongoose';
import validator from 'validator'; // Validates our password with required params
import { hashSync, compareSync } from 'bcrypt-nodejs'; // Hash our password & compare typed password to hash
import jwt from 'jsonwebtoken'; // Gives the front end a JSON web token
import uniqueValidator from 'mongoose-unique-validator'; // Validates the uniqueness of schema attribute

import { passwordReg } from './user.validation';
import constants from '../../config/constants';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email!',
    },
  },
  firstName: {
    type: String,
    required: [true, 'FirstName is required!'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'LastName is required!'],
    trim: true,
  },
  userName: {
    type: String,
    required: [true, 'UserName is required!'],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    trim: true,
    minlength: [6, 'Password need to be longer!'],
    validate: {
      validator(password) {
        return passwordReg.test(password);
      },
      message: '{VALUE} is not a valid password!',
    },
  },
}, { timestamps: true });

// Plugin

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
});

// Running scripts
// Before saving the password to the database we want to encrypt the password for security reasons
UserSchema.pre('save', function (next) {
  // we want the user to be able to change his password so the line below allows the new password to be hashed
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    // new password going to be new password encrypted
    return next();
  }
});

// Methods
// password is the password user types

UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },
  authenticateUser(password) {
    return compareSync(password, this.password);
    // hashSync(password) === this.password,
    // password comes from the front end and this.password is the object's stored password
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id,
      },
      constants.JWT_SECRET,
    );
  },
  toAuthJSON() {
    return {
      _id: this._id,
      userName: this.userName,
      token: `JWT ${this.createToken()}`,
    };
  },
  toJSON() {
    return {
      _id: this._id,
      userName: this.userName,
    };
  },
};

export default mongoose.model('User', UserSchema);

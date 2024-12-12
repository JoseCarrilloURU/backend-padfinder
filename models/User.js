import { Schema, model } from 'mongoose';
import Person from './Person.js';
import Secure from '../components/Secure/Secure.js';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  person_id: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
    required: true,
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await Secure.encrypt(this.password, 10);
  }
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    update.password = await Secure.encrypt(update.password, 10);
  }
  next();
});

userSchema.statics.findByEmail = async function (email) {
  const person = await Person.findOne({ email });
  if (!person) {
    return null;
  }
  const user = await this.findOne({ person_id: person._id });
  return user;
};

userSchema.statics.createPersonAndUser = async function (data) {
  const {
    username,
    password,
    image,
    name,
    lastname,
    email,
    genre,
    experience,
    preferred_genre,
  } = data;
  const session = await this.startSession();
  session.startTransaction();

  const userData = {
    username,
    password,
    image,
  };

  try {
    let person = await Person.findOne({ email }).session(session);

    if (!person) {
      const existingUser = await this.findOne({ username }).session(session);
      if (existingUser) {
        await session.abortTransaction();
        session.endSession();
        return { msg: 'User already exists.' };
      }

      const newPerson = await Person.create(
        [{ name, lastname, email, genre, experience, preferred_genre }],
        { session },
      );
      person = newPerson[0];
    } else {
      const existingUser = await this.findOne({ username }).session(session);
      if (existingUser) {
        await session.abortTransaction();
        session.endSession();
        return { msg: 'User already exists.' };
      }
    }

    userData.person_id = person._id;
    const newUser = await this.create([userData], { session });

    await session.commitTransaction();
    session.endSession();

    const userObject = newUser[0].toObject();
    delete userObject.password;
    delete userObject.image;

    return {
      msg: 'Usuario creado con exito',
      data: { person, user: userObject },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.email) {
        throw new Error('Email has already been assigned');
      }
      if (error.keyPattern && error.keyPattern.username) {
        throw new Error('Username has already been assigned');
      }
    }

    throw new Error('Error saving user');
  }
};

userSchema.statics.validateCredentials = async function (identifier, password) {
  let user;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
    const person = await Person.findOne({ email: identifier });
    if (person) {
      user = await this.findOne({ person_id: person._id });
    }
  } else {
    user = await this.findOne({ username: identifier });
  }

  if (user && (await Secure.compare(password, user.password))) {
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  } else {
    throw new Error('Invalid credentials');
  }
};

const User = model('User', userSchema);

export { User };

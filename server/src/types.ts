import { Request, Response, NextFunction } from 'express';

// export interface IUser {
//   _id?: ObjectId;
//   username: string;
//   email: string;
//   password: string;
//   dogName: string;
//   dogPhoto: string;
//   events: ObjectId[] | []; // ! or null?
//   createdAt?: Date;
//   updatedAt?: Date;
// }

export interface IUser {
  name: string;
  email: string;
  password: string;
  dogName: string;
  dogPhoto: string;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
  isModified(path: string): boolean;
}


// Define an interface representing a doocument in mongoDB (Typescript)
export interface IEvent {
  place_id: string;
  park_name: string;
  address: string;
  date: Date;
  user: string;
  dog_avatar: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResEvent {
  place_id: string;
  park_name: string;
  address: string;
  date: string;
  user: string;
  dog_avatar: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInvalidEvent {
  place_id?: string;
  park_name?: string;
  address?: string;
  date?: Date;
  user?: string;
  dog_avatar?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

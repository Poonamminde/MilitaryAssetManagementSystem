import { Document, Types } from "mongoose";

export enum Role {
  ADMIN = "Admin",
  BASE_COMMANDER = "Base Commander",
  LOGISTICS_OFFICER = "Logistics Officer",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  assignedBase: string;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  role: Role;
  assignedBase: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  assignedBase: string;
}

export interface IJwtPayload {
  userId: string;
  role: Role;
}

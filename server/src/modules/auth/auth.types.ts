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

export interface IAuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  assignedBase: string;
}

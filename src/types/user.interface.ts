export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister extends IUserLogin {
  name: string;
}

export interface IUserResponse {
  _id: string | any; // Menerima baik string maupun ObjectId
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date | string | any; // Menerima berbagai format tanggal
  updatedAt: Date | string | any; // Menerima berbagai format tanggal
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}
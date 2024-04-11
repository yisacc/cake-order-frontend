import { CakeOrder } from './types';
export interface IUser {
  id: string;
  email: string;
}
export interface IToken {
  token: string;
  expires: string;
}
export interface ITokens {
  access: IToken;
  refresh: IToken;
}
export interface GenericResponse {
  status: string;
  message: string;
}

export interface ILoginResponse {
  status: string;
  user: IUser;
  tokens: ITokens;
}


export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface IUserResponse {
  status: string;
  data: {
    user: IUser;
  };
}

export interface ICakeShape {
  id: string;
  name: string;
  price: number;
}

export interface ICakeShapeResponse {
  status: string;
  data: ICakeShape[];
}

export interface ICakeSize {
  id: string;
  size: string;
  price: number;
}

export interface ICakeSizeResponse {
  status: string;
  data: ICakeSize[];
}

export interface ICakeTopping {
  id: string;
  type: string;
  quantity: number;
  price: number;
}

export interface ICakeToppingResponse {
  status: string;
  data: ICakeTopping[];
}

export interface IToppingsQuantity {
  [key: string]: number;
}

export interface CakeOrder {
  cakeShapeId: string;
  cakeSizeId: string;
  toppingIds?: string[];
  message?: string;
}

export interface CakePriceResponse {
  status: string;
  data: { price: number };
}

export interface CakeOrderResponse {
  status: string;
  order: CakeOrder;
  message: string;
}


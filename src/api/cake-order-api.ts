import { authApi } from "./auth-api";
import { CakeOrder, CakeOrderResponse, CakePriceResponse, ICakeShapeResponse, ICakeSizeResponse, ICakeToppingResponse } from "./types";

export const getCakeShapes = async () => {
  const response = await authApi.get<ICakeShapeResponse>('cake-shapes');
  return response.data;
}
export const getCakeSizes = async () => {
  const response = await authApi.get<ICakeSizeResponse>('cake-sizes');
  return response.data;
}
export const getCakeToppings = async () => {
  const response = await authApi.get<ICakeToppingResponse>('toppings');
  return response.data;
}


export const getCakePrice = async (order: CakeOrder) => {
  const response = await authApi.post<CakePriceResponse>('orders/price', order);
  return response.data;
}

export const createOrder = async (order: CakeOrder) => {
  const response = await authApi.post<CakeOrderResponse>('orders', order);
  return response.data;
}
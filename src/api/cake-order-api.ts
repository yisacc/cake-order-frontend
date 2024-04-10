import { authApi } from "./auth-api";
import { ICakeShapeResponse, ICakeSizeResponse, ICakeToppingResponse } from "./types";

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

import axios from 'axios';
import { API_URLS } from '../models/ApiRoutes';

const BASE_URL = API_URLS.LOCAL_BASE_ROUTE;
// Functions for making HTTP requests using Axios.
// Note: The 'data' parameter is typed as 'any' to allow flexibility in the type of data being sent.
// However, when calling these functions, it's recommended to provide the correct type for 'data'
// to ensure type safety. For example:
// const response = await post<UserResponse>(API_URLS.USER_ROUTE, data);

export const get = async <T>(endpoint: string) => {
  const response = await axios.get<T>(`${BASE_URL}${endpoint}`);
  return response.data;
};

export const post = async <T>(endpoint: string, data: any) => {
  const response = await axios.post<T>(`${BASE_URL}${endpoint}`, data);
  return response.data;
};

export const put = async <T>(endpoint: string, data: any) => {
  const response = await axios.put<T>(`${BASE_URL}${endpoint}`, data);
  return response.data;
};

export const del = async <T>(endpoint: string, data: any) => {
  const config = {
    data: data,
  };
  const response = await axios.delete<T>(`${BASE_URL}${endpoint}`, config);
  return response.data;
};

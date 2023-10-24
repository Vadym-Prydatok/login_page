/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../types/User';

const BASE_URL = 'https://technical-task-api.icapgroupgmbh.com/api/table';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: User,
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  return fetch(url, options)
    .then(response => {

      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    })
}

export const client = {
  initGet: <T>() => request<T>(BASE_URL),
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
};
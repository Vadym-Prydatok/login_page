import { User } from '../types/User';
import { client } from '../api/fetchData';
import { Data } from '../types/Data';

export const getData = () => {
  return client.get<Data>('/');
};

export const getUsers = (url: string) => {
  return client.get<User[]>(url);
};

export const getUser = (userId: string) => {
  return client.get<User>(`/users/${userId}`);
};

// export const deleteTodo = (todoId: number) => {
//   return client.delete(`/todos/${todoId}`);
// };

// export const completeTodo = (todoId: number, data: boolean) => {
//   return client.patch(`/todos/${todoId}`, { completed: data });
// };

// export const renameTodo = (todoId: number, title: string) => {
//   return client.patch(`/todos/${todoId}`, { title });
// };

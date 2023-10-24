import { User } from "../types/User"

export  const visibleData = (array: User [], start: number, end: number) => {
  return array.slice(start, end)
}
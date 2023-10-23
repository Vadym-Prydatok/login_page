import { User } from "./User"

export type Data = {
  "count": number,
  "next": string,
  "previous": null | string,
  "results": User [],
}
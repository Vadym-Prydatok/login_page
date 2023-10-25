import { User } from "../types/User";

export const visibleData = (
  array: User[],
  start: number,
  end: number,
  sortBy: string
) => {
  const cutArray = array.slice(start, end);

  if (!sortBy) {
    return cutArray;
  }

  switch (sortBy) {
    case "ID":
      return cutArray.sort((a, b) => a.id - b.id);

    case "Name":
      return cutArray.sort((a, b) => a.name.localeCompare(b.name));

    case "Email":
      return cutArray.sort((a, b) => a.email.localeCompare(b.email));

    case "Birthday Date":
      return cutArray.sort((a, b) => {
        const dateA = a.birthday_date.split("-").reverse().join("");
        const dateB = b.birthday_date.split("-").reverse().join("");
        return dateA.localeCompare(dateB);
      });

    case "Phone Number":
      return cutArray.sort((a, b) => +a.phone_number - +b.phone_number);

    case "Address":
      return cutArray.sort((a, b) => a.email.localeCompare(b.email));

    default:
      return cutArray;
  }
};

import { useEffect, useState } from "react";
import { getData } from "../api/fetchClient";
import { User } from "../types/User";
import { Data } from "../types/Data";
import { useNavigate } from "react-router-dom";

export const Main = () => {
  const [data, setData] = useState<Data | null>(null);
  const [users, setUsers] = useState<User []>([])
  
  const navigate = useNavigate();

  const loadingData = async () => {
    try {
      const data = await getData();

      setData(data);
      setUsers(data.results)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadingData();
  }, []);

  console.log(data)
  return (
    <div>
      <button onClick={() => navigate('/')}>Back</button>

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
          ))}
      </ul>
    </div>
  );
};

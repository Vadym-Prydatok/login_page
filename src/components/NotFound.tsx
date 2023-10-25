import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('..');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);
  
  return (
    <h1>Not Found</h1>
  )
} 
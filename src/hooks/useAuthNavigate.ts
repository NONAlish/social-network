import { useNavigate } from "react-router-dom";

const useAuthNavigate = () => {
  const navigate = useNavigate();

  const navigateToAuth = (path: string) => {
    navigate(`/auth/${path}`);
  };

  return navigateToAuth;
};

export default useAuthNavigate;

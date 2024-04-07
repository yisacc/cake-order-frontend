import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => navigate('/');

  return (
    <div>
      <h1>404 - Not Found</h1>
      <button onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
}

export default Page404;
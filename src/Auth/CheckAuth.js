 
import { useNavigate } from "react-router-dom";

const CheckAuth = async (accessToken) => {
  const navigate = useNavigate();
  try {
    const { data } = await axios.get(
      "https://hrms-backend-9qzj.onrender.com/api/checkAuth",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (data.success) {
      const data1 = JSON.stringify(data);
      localStorage.setItem("authUser", data1);
    }
  } catch (error) {
    localStorage.removeItem("authUser");
    navigate("/");
  }
};

export default CheckAuth;

import { useNavigate } from "react-router-dom";

const CheckAuth = async (accessToken) => {
  const navigate = useNavigate();
  try {
    const { data } = await axios.get(
      import.meta.env.VITE_BASE_URL + "/checkAuth",
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

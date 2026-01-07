// ProtectedRoute.jsx

import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAttendance } from "../Zustand/PersonalAttendance"
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {

  const { fetchUser } = useAttendance();
  const token = localStorage.getItem("hrmsAuthToken");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("protected route ")
    if (!token) {
      toast.error("Please login to continue");
      navigate("/", { replace: true });
      return;
    }

    // const getProfile = async () => {
    //   try {
    //     const { data } = await axios.get(
    //       "https://backend.mastersaab.co.in/api/profile/get",
    //       {
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("hrmsAuthToken")}`,
    //         },
    //       }
    //     );

    //   } catch (error) {
    //     toast.error("Session expired, please login again");
    //     localStorage.removeItem("hrmsAuthToken");
    //     navigate("/logout", { replace: true });
    //   } finally {
    //     setChecking(false);
    //   }
    // };

    fetchUser(token);
  }, []);


  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
}

import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "./store/hook/hook";
import { refreshUser } from "./store/slices/UserAuthSlice";
import AppRoutes from "./routes/AppRoutes";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshUser()).unwrap();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Routes from "./Routes";

function App() {
  // axios.defaults.baseURL = "http://localhost:5000/api/";
  axios.defaults.baseURL =
    "https://bally-backend-production.up.railway.app/api/";

  return (
    <>
      <ToastContainer />
      <Routes />
    </>
  );
}

export default App;

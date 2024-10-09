import { ToastContainer } from "react-toastify";
// import { Login } from "./login/login";
import { Route , Routes} from 'react-router-dom'
import { Register } from "./register/Register";
import { Home } from "./home/Home.jsx";
import { VerifyUser } from "./utils/VerifyUser.jsx";
import { Login } from "./login/Login.jsx";
function App() {

  return (
    <>
     <div className="p-2 w-screen h-screen flex items-center justify-center">
      <Routes>
      
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route element={<VerifyUser/>}>
        <Route path="/" element={<Home/>}/>
        </Route>
      </Routes>
      
      <ToastContainer/>
     </div>
    </>
  )
}

export default App





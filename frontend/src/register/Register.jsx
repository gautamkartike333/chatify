// import React, { useState } from "react";
// import { Link, Navigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// export const Register = () => {
//   const navigate = useNavigate();

//   const [inputdata, setinputdata] = useState({});
//   const [loading, setLoading] = useState(false);

//   const handleInput = (e) => {
//     setinputdata({
//       ...inputdata,
//       [e.target.id]: e.target.value,
//     });
//   };
//   console.log(inputdata);

//   //handleSubmit function
// const handleSubmit = ()=>{

// }

//   return (
//     <>
//       <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
//         <div className="w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backderop-filter backdrop-blur-lg bg-opacity-0 ">
//           <h1 className="text-3xl font-bold text-center text-gray-300">
//             Register <span className="text-gray-500">Chatters</span>
//           </h1>
//           <form onSubmit={handleSubmit} className="flex flex-col text-gray-200">
//             <div>
//               <label className="p-2 label">
//                 <span className="flex-bold text-gray-950 text-xl label-text">
//                   Full Name :
//                 </span>
//               </label>
//               <input
//                 id="fullname"
//                 type="text"
//                 onChange={handleInput}
//                 placeholder="Enter your fullname"
//                 required
//                 className="w-full input input-bordered h-10"
//               />
//             </div>

//             <div>
//               <label className="p-2 label">
//                 <span className="flex-bold text-gray-950 text-xl label-text">
//                   Username :
//                 </span>
//               </label>
//               <input
//                 id="username"
//                 type="text"
//                 onChange={handleInput}
//                 placeholder="Enter your username"
//                 required
//                 className="w-full input input-bordered h-10"
//               />
//             </div>
//             <div>
//               <label className="p-2 label">
//                 <span className="flex-bold text-gray-950 text-xl label-text">
//                   Gender:
//                 </span>
//               </label>
//               <select
//                 id="gender"
//                 onChange={handleInput}
//                 required
//                 className="w-full h-10 bg-gray-800 text-white rounded-lg p-2 custom-select appearance-none"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//             </div>

//             <div>
//               <label className="p-2 label">
//                 <span className="flex-bold text-gray-950 text-xl label-text">
//                   Email :
//                 </span>
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 onChange={handleInput}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full input input-bordered h-10"
//               />
//             </div>
//             <div>
//               <label className="p-2 label">
//                 <span className="flex-bold text-gray-950 text-xl label-text">
//                   Password :
//                 </span>
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 onChange={handleInput}
//                 placeholder="Enter your password"
//                 required
//                 className="w-full input input-bordered h-10"
//               />
//             </div>
//             <div>
//               <label className="p-2 label">
//                 <span className="flex-bold text-gray-950 text-xl label-text">
//                   Confirm Password :
//                 </span>
//               </label>
//               <input
//                 id="confpassword"
//                 type="password"
//                 onChange={handleInput}
//                 placeholder="Confirm your password"
//                 required
//                 className="w-full input input-bordered h-10"
//               />
//             </div>
//             <button
//               type="submit"
//               className="mt-4 self-center w-auto px-2 py-1 bg-gray-950 text-lg text-white rounded-lg hover:bg-gray-900 hover:scale-105 transition-transform duration-300"
//             >
//               {loading ? "loading.." : "Signin"}
//             </button>
//           </form>
//           <div className="pt-2 ">
//             <p className="text-gray-50 text-sm font-semibold ">
//               Already have an Account ?{" "}
//               <Link to={"/login"}>
//                 <span className="text-gray-300 font-bold underline cursor-pointer hover:text-blue-200">
//                   LogIn Now!
//                 </span>
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

/////////////////////////////////////////////////////////////////////////


import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const navigate = useNavigate();
  const {setauthUser} = useAuth();
  const [inputData, setinputData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setinputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (inputData.password !== inputData.confpassword){
      setLoading(false);
      return toast.error("Both Password must be same");
    }

    try {
      const register = await axios.post(
        `/api/auth/register`,
        inputData
      );
      const data = register.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }
      toast.success(data?.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      // setAuthUser(data);
      setauthUser(data)
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-screen mx-auto">
        <div className="w-full max-w-md p-4 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          <h1 className="text-2xl font-bold text-center text-gray-300 mb-4">
            Register <span className="text-gray-500">Chatters</span>
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col text-gray-200 space-y-3"
          >
            {/* Full Name Row */}
            <div className="flex items-center space-x-2 ">
              <label htmlFor="fullname" className=" text-lg w-1/3">
                Full Name:
              </label>
              <input
                id="fullname"
                type="text"
                onChange={handleInput}
                placeholder="Enter your fullname"
                required
                className="w-2/3 input input-bordered h-8"
              />
            </div>

            {/* Username Row */}
            <div className="flex items-center space-x-2">
              <label htmlFor="username" className=" text-lg w-1/3">
                Username:
              </label>
              <input
                id="username"
                type="text"
                onChange={handleInput}
                placeholder="Enter your username"
                required
                className="w-2/3 input input-bordered h-8"
              />
            </div>

            {/* Gender Row */}
            <div className="flex items-center space-x-2">
              <label htmlFor="gender" className=" text-lg w-1/3">
                Gender:
              </label>
              <select
                id="gender"
                onChange={handleInput}
                required
                className="w-2/3 h-8 bg-gray-800 text-white rounded-lg p-1 custom-select appearance-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Email Row */}
            <div className="flex items-center space-x-2">
              <label htmlFor="email" className=" text-lg w-1/3">
                Email:
              </label>
              <input
                id="email"
                type="email"
                onChange={handleInput}
                placeholder="Enter your email"
                required
                className="w-2/3 input input-bordered h-8"
              />
            </div>

            {/* Password Row */}
            <div className="flex items-center space-x-2">
              <label htmlFor="password" className=" text-lg w-1/3">
                Password:
              </label>
              <input
                id="password"
                type="password"
                onChange={handleInput}
                placeholder="Enter your password"
                required
                className="w-2/3 input input-bordered h-8"
              />
            </div>

            {/* Confirm Password Row */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="confpassword"
                className=" text-lg w-1/3"
              >
                Confirm Password:
              </label>
              <input
                id="confpassword"
                type="password"
                onChange={handleInput}
                placeholder="Confirm your password"
                required
                className="w-2/3 input input-bordered h-8"
              />
            </div>

            <button
              type="submit"
              className="self-center w-auto px-2 py- text-lg text-white rounded-lg hover:bg-gray-700 hover:scale-105 transition-transform duration-300"
            >
              {loading ? "loading.." : "Register"}
            </button>
          </form>

          <div className="pt-2 flex justify-center text-center">
            <p className="text-gray-50 text-sm font-semibold ">
              Already have an Account?{" "}
              <Link to="/login">
                <span className="text-gray-300 font-bold underline cursor-pointer hover:text-blue-500">
                  Click to Log In Now!
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};


/////////////////////////2////////////////

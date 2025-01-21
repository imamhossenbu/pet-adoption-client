import { useContext } from "react";
import AuthContext from "../context/authContext";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({children}) => {
    const {user,loading} = useContext(AuthContext);;

    if(loading){
        <p>loading......</p>
    }

    if(!user){
       <Navigate to='/login' state={{from:location.pathname}}></Navigate>
    }
    else{
        return children;
    }
   
};

export default PrivateRoute;
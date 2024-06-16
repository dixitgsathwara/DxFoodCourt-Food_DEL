import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets'
import { BASE_URL } from '../../../Utils/constant'
import axios from'axios'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import {toast} from 'react-toastify'
const LoginPopup = ({ setShowLogin }) => {
    const [currentState, setCurrentState] = useState("Login")
    const {setToken}=useContext(StoreContext);
    const [data,setData]=useState({
        name:"",
        email:"",
        password:""
    })
    
    const onChangeHandler=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setData(data=>({
            ...data,[name]:value
        }))
    }

    const onLogin=async(e)=>{
        e.preventDefault();
        let url=BASE_URL;
        if(currentState==="Login"){
            url+='/api/user/login';
        }else{
            url+='/api/user/register';
        }
        const response=await axios.post(url,data);
        if(response.data.success){
            setToken(response.data.accesstoken);
            localStorage.setItem("token",response.data.accesstoken);
            setShowLogin(false);
        }
        else{
       toast.error(response.data.message)
        }
    }
    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currentState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currentState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Name' required />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, i agree to the terms of use & privacy policy</p>
                </div>
                {currentState === "Login"
                    ? <p>Create New Account? <span onClick={() => setCurrentState("Sign Up")}>Click Here</span></p>
                    : <p>Already Have an Account? <span onClick={() => setCurrentState("Login")}>Login Here</span></p>
                }

            </form>
        </div>
    )
}

export default LoginPopup
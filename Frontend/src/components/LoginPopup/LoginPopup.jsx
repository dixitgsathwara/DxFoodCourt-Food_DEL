import React, { useEffect, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets'
import { BASE_URL } from '../../../Utils/constant'
import axios from 'axios'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'

const LoginPopup = ({ setShowLogin }) => {
    const [currentState, setCurrentState] = useState("Login")
    const [forgot, setForgot] = useState(false);
    const { setToken } = useContext(StoreContext);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({
            ...data, [name]: value
        }))
    }
    const onLogin = async (e) => {
        e.preventDefault();
        let url = BASE_URL;
        if (currentState === "Login") {
            url += '/api/user/login';
        } else {
            url += '/api/user/register';
        }
        const response = await axios.post(url, data);
        if (response.data.success) {
            setToken(response.data.accesstoken);
            localStorage.setItem("token", response.data.accesstoken);
            setShowLogin(false);
        }
        else {
            toast.error(response.data.message)
        }
    }
    const onSend = async (e) => {
        e.preventDefault();
        const response = await axios.post(BASE_URL + "/api/user/forgot", data);
        if (response.data.success) {
            setShowLogin(false)
            toast.success("Email has been send to your registered email account. open your Email and update your password")
        }
        else {
            toast.error(response.data.message);
            setData({
                name: "",
                email: "",
                password: ""
            })
        }
    }
    const handleCallbackResponse = async (res) => {
        const user = jwtDecode(res.credential);
        console.log(user);
        const userData = {
            name: user.name,
            email: user.email
        }
        const response = await axios.post(BASE_URL + "/api/user/googlelogin", userData);
        if (response.data.success) {
            setToken(response.data.accesstoken);
            localStorage.setItem("token", response.data.accesstoken);
            setShowLogin(false);
        }
        else {
            toast.error(response.data.message)
        }
    }
    useEffect(() => {
        google.accounts.id.initialize({
            client_id: "163521476600-7fcgshvqn9pch9i7i4o95p5b655dot77.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large" }
        )
    }, [])
    return (
        <div className="login-popup">
            {forgot
                ?
                <>
                    <form onSubmit={onSend} className="login-popup-container">
                        <div className="login-popup-title">
                            <h2>Forgot Password</h2>
                            <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                        </div>
                        <div className="login-popup-inputs">
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Enter your register email' required />
                            <button type='submit'>Send</button>
                        </div>
                    </form>
                </>
                :
                <form onSubmit={onLogin} className="login-popup-container">
                    <div className="login-popup-title">
                        <h2>{currentState}</h2>
                        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <div className="login-popup-inputs">
                        {currentState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Name' required />}
                        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required />
                        <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                        {currentState === "Login" ? <p onClick={() => setForgot(true)}>Forgot Password ? </p> : <></>}
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
                    <div id="signInDiv"></div>
                </form>
            }
        </div>
    )
}

export default LoginPopup
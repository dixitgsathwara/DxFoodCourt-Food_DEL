import React, { useEffect, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets'
import { BASE_URL } from '../../../Utils/constant'
import axios from 'axios'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { toast } from 'react-toastify'
import {jwtDecode} from 'jwt-decode'

const LoginPopup = ({ setShowLogin }) => {
    const [currentState, setCurrentState] = useState("Login")
    const [forgot, setForgot] = useState(false);
    const { setToken } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        let url = BASE_URL;
        if (currentState === "Login") {
            url += '/api/user/login';
        } else {
            url += '/api/user/register';
        }
        try {
            const response = await axios.post(url, data);
            if (response.data.success) {
                setToken(response.data.accesstoken);
                localStorage.setItem("token", response.data.accesstoken);
                setShowLogin(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const onSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(BASE_URL + "/api/user/forgot", data);
            if (response.data.success) {
                setShowLogin(false);
                toast.success("Email has been sent to your registered email account. Open your email and update your password");
            } else {
                toast.error(response.data.message);
                setData({
                    name: "",
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleCallbackResponse = async (res) => {
        setLoading(true);
        const user = jwtDecode(res.credential);
        const userData = {
            name: user.name,
            email: user.email
        }
        try {
            const response = await axios.post(BASE_URL + "/api/user/googlelogin", userData);
            if (response.data.success) {
                setToken(response.data.accesstoken);
                localStorage.setItem("token", response.data.accesstoken);
                setShowLogin(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
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
            {loading ? (
                <div className='verify'>
                    <div className="spinner">
        
                    </div>
                </div>
            ) : forgot ? (
                <form onSubmit={onSend} className="login-popup-container">
                    <div className="login-popup-title">
                        <h2>Forgot Password</h2>
                        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <div className="login-popup-inputs">
                        <p style={{ color: "black" }}>
                            Enter the email address associated with your account and we will send you a link to reset your password
                        </p>
                        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Enter your registered email' required />
                        <button type='submit'>Send</button>
                    </div>
                </form>
            ) : (
                <form onSubmit={onLogin} className="login-popup-container">
                    <div className="login-popup-title">
                        <h2>{currentState}</h2>
                        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                    </div>
                    <div className="login-popup-inputs">
                        {currentState === "Login" ? null : (
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Name' required />
                        )}
                        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required />
                        <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                        {currentState === "Login" ? (
                            <p onClick={() => setForgot(true)}>Forgot Password?</p>
                        ) : null}
                    </div>
                    <button type='submit'>{currentState === "Sign Up" ? "Create Account" : "Login"}</button>
                    <div className="login-popup-condition">
                        <input type="checkbox" required />
                        <p>By continuing, I agree to the terms of use & privacy policy</p>
                    </div>
                    {currentState === "Login" ? (
                        <p>Create New Account? <span onClick={() => setCurrentState("Sign Up")}>Click Here</span></p>
                    ) : (
                        <p>Already Have an Account? <span onClick={() => setCurrentState("Login")}>Login Here</span></p>
                    )}
                    <div id="signInDiv"></div>
                </form>
            )}
        </div>
    )
}

export default LoginPopup

import React, { useState } from 'react'
import './Forgot.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../Utils/constant';
import axios from 'axios';
const Forgot = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [data, setData] = useState({
        password: "",
        newPassword: ""
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({
            ...data, [name]: value
        }))
    }

    const updatePassword = async (e) => {
        e.preventDefault();
        if (data.password !== data.newPassword) {
            toast.error("Password and confirmation password do not match. Ensure both entries are identical.")
            setData({
                password: "",
                newPassword: ""
            })
        }
        else {
            const response = await axios.post(BASE_URL + "/api/user/updatepassword", {password:data.password},{ headers: { token } });
            if (response.data.success) {
                navigate("/");
                toast.success("Your password update successfully!!")
            } else {
                toast.error(response.data.message);
            }
        }
    }

    return (
        <div className='container'>
            <form onSubmit={updatePassword} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>Forgot Password</h2>
                </div>
                <div className="login-popup-inputs">
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Enter your password' required />
                    <input name='newPassword' onChange={onChangeHandler} value={data.newPassword} type="password" placeholder='Confirm your password' required />
                    <button type='submit'>Update</button>
                </div>
            </form>
        </div>
    )
}

export default Forgot
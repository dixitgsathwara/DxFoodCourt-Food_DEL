import React, { useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BASE_URL } from '../../../Utils/constant'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
const [searchParams,setSearchParams]=useSearchParams();
const success=searchParams.get("success");
const orderId=searchParams.get("orderId");
const navigate=useNavigate();
const verifyPayment=async()=>{
    const response=await axios.post(BASE_URL+"/api/order/verify",{success,orderId});
    if (response.data.success) {
        navigate("/myorders");
        toast.success("Your order purchase successfully!!")
    }else{
        navigate("/");
    }
    }
        useEffect(()=>{
            verifyPayment();
        },[]);
  return (
    <div className='verify'>
        <div className="spinner">

        </div>
    </div>
    
  )
}

export default Verify
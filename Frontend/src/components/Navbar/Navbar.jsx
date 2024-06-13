import React, { useContext, useState } from 'react'
import { assets } from '../../assets/frontend_assets/assets'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  }
  return (
    <div className="navbar">
      <Link to='/'><img src={assets.logo} alt="" className='logo' /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => { setMenu("home") }} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => { setMenu("menu") }} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => { setMenu("mobile-app") }} className={menu === "mobile-app" ? "active" : ""}>Mobile-app</a>
        <a href='#footer' onClick={() => { setMenu("contact-us") }} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
      </ul>
      <div className="navbar-right">
        
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} width="29px" height="30px" alt="" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>{!token
          ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='nav-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}>< img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /> <p>Logout</p></li>
            </ul>
          </div>}

      </div>
    </div>
  )
}

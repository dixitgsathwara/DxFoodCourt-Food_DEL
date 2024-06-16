import { createContext, useEffect, useState } from "react";
import { BASE_URL } from '../../Utils/constant'
import axios from 'axios'

export const StoreContext = createContext(null);
const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const fetchFoodList = async () => {
        const response = await axios.get(`${BASE_URL}/api/food/list`);
        setFoodList(response.data.data);
    }
    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((pre) => ({ ...pre, [itemId]: 1 }))
        } else {
            setCartItems((pre) => ({ ...pre, [itemId]: pre[itemId] + 1 }))
        }
        if (token) {
            await axios.post(BASE_URL + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }
    const removeFromCart = async (itemId) => {
        setCartItems((pre) => ({ ...pre, [itemId]: pre[itemId] - 1 }))
        if (token) {
            await axios.post(BASE_URL + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }
    const loadCartData = async (token) => {
        const response = await axios.post(BASE_URL + "/api/cart/get", {}, { headers: { token } })
        setCartItems(response.data.cartData);
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }
    const verifyToken = async (token) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/user/getinfo`, {}, { headers: { token } });
            return response.data.success;
        } catch (error) {
            return false;
        }
    };
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                const isValidToken = await verifyToken(storedToken);
                if (isValidToken) {
                    setToken(storedToken);
                    await loadCartData(storedToken);
                } else {
                    localStorage.removeItem("token");
                    setToken("");
                }
            }
        }
        loadData();
    }, []);
    const ContextValue = {
        food_list,
        cartItems,
        setCartItems,
        getTotalCartAmount,
        addToCart,
        removeFromCart,
        token,
        setToken
    }
    return (
        <StoreContext.Provider value={ContextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;
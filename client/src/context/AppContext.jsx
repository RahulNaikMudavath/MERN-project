import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const AppContext = createContext()  // creating context using use create context hook...will let you share data (like user info) across multiple components **without prop drilling**.

export const  AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate()
    const [user,setuser] = useState(null)
    const [isSeller,setisSeller] = useState(false)
    const [showuserlogin,setshowuserlogin] = useState(false)
    const [products,setproducts] = useState([])

    const [cartitems,setcartitems] = useState({})
    const [searchquery,setsearchquery] = useState("")
    

    //fetch seller status
    const fetchseller = async()=>{
        try {
            const {data} = await axios.get("/api/seller/is-auth")
            if(data.success){
                setisSeller(true)
            } else{
                setisSeller(false)
            }
        } 
        catch (error) {
            setisSeller(false)
            console.log(error.message);
            }
    }

    //fetch all products
    const fetchproducts = async ()=>{
        try {
            const { data } = await axios.get("/api/product/list")
            if (data.success) {
                setproducts(data.products)
            } else {
                setproducts(dummyProducts)
            }
        } catch (error) {
            console.log(error.message)
            setproducts(dummyProducts)
        }
    }

    //fetch user status
    const fetchuser = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth")
            if (data.success) {
                setuser(data.user)
                if (data.user.cartItems) {
                    setcartitems(data.user.cartItems)
                }
            } else {
                setuser(null)
            }
        } catch (error) {
            setuser(null)
            console.log(error.message)
        }
    }

    //Add product to cart
    const addtocart = async (itemid)=>{
        let cartdata = structuredClone(cartitems)

        if(cartdata[itemid]){
            cartdata[itemid] += 1
        }
        else {
            cartdata[itemid] = 1;
        }
        setcartitems(cartdata)
        toast.success("added to cart")

        if (user) {
            try {
                await axios.post("/api/cart/update", { cartItems: cartdata })
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    //Update card item quantity
    const updatecartitem = async (itemid, quantity) =>{
        let cartdata = structuredClone(cartitems)
        cartdata[itemid] = quantity
        setcartitems(cartdata)
        toast.success("cart updated")

        if (user) {
            try {
                await axios.post("/api/cart/update", { cartItems: cartdata })
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    //remove product from cart
    const removefromcart = async (itemid) =>{
        let cartdata = structuredClone(cartitems)
        if(cartdata[itemid]){
            cartdata[itemid] -= 1
            if(cartdata[itemid] === 0){
                delete cartdata[itemid]
            }
        }
        toast.success("removed from cart")
        setcartitems(cartdata)

        if (user) {
            try {
                await axios.post("/api/cart/update", { cartItems: cartdata })
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    // getting the cart item count
    const getcartcount = ( )=>{
        let totalcount = 0;
        for(const item in cartitems){
            totalcount += cartitems[item];
        }
        return totalcount
    }


    // get total cart amount
    const getcartamount = () =>{
        let totalamount = 0;
        for(const items in cartitems){
            let iteminfo = products.find((product)=> product._id === items);
            if(iteminfo && cartitems[items] > 0){
                totalamount  += iteminfo.offerPrice * cartitems[items]
            }
           
        }
         return Math.floor(totalamount * 100)/100
    }




    useEffect(()=>{
        fetchseller()
        fetchproducts()
        fetchuser()
    },[])

    const value ={navigate , user , setuser,setisSeller,isSeller , showuserlogin,setshowuserlogin,products,currency,addtocart,updatecartitem,removefromcart,cartitems,setcartitems,searchquery,setsearchquery,getcartamount, getcartcount,axios,fetchuser}
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}
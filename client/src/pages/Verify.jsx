import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Verify = () => {
    const { axios, navigate, setcartitems } = useAppContext()
    const [searchParams] = useSearchParams()
    
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try {
            if (!success || !orderId) {
                navigate("/cart")
                return
            }

            const { data } = await axios.post("/api/order/verifyStripe", { success, orderId })
            if (data.success) {
                toast.success("Payment successful! Order placed.")
                setcartitems({}) // clear local cart items
                navigate("/my-orders")
            } else {
                toast.error(data.message || "Payment failed or cancelled")
                navigate("/cart")
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
            navigate("/cart")
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium text-lg">Verifying your payment, please wait...</p>
        </div>
    )
}

export default Verify

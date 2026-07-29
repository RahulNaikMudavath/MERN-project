import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//place order COD: /api/order/cod

export const placeOrderCOD = async(req,res)=>{
    try {
        const {userId, items, address} = req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Address and items are required"});
        }
        //calculate total amount using items
        let amount = await items.reduce(async(acc, item)=>{
                const product = await Product.findById(item.product);
                return (await acc) + (product.offerPrice * item.quantity);
        }, 0);

        //add tax charge 2%
        amount += Math.floor(amount * 0.02);

        await Order.create({userId, items, amount, address, paymentType: "COD"});
        
        // Clear the user's cart in database
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        res.json({success: true, message: "Order placed successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


//get orders by user ID : /api/order/user
export const getUserOrders = async(req,res)=>{
    try {
        const {userId} = req.body;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]

        }).populate('items.product address').sort({createdAt: -1});
        res.json({success: true, orders});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
        
    }
}

//Get all orders( for seller/admin): /api/order/seller
export const getAllOrders = async(req,res)=>{
    try {
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]

        }).populate('items.product address').sort({createdAt: -1});
        res.json({success: true, orders});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
        
    }
}

// Place order using Stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Address and items are required" });
        }

        // Calculate amount and prepare line items for Stripe
        let subtotal = 0;
        const line_items = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.json({ success: false, message: `Product ${item.product} not found` });
            }
            subtotal += product.offerPrice * item.quantity;

            line_items.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: product.image && product.image.length > 0 ? [product.image[0]] : []
                    },
                    unit_amount: Math.round(product.offerPrice * 100) // stripe expects cents
                },
                quantity: item.quantity
            });
        }

        // Add 2% tax
        const taxAmount = Math.floor(subtotal * 0.02);
        const amount = subtotal + taxAmount;

        if (taxAmount > 0) {
            line_items.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Tax (2%)',
                        description: 'State and local tax'
                    },
                    unit_amount: Math.round(taxAmount * 100)
                },
                quantity: 1
            });
        }

        // Save order as unpaid in DB
        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Stripe",
            isPaid: false
        });

        const origin = req.headers.origin || 'http://localhost:5173';
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Verify Stripe Payment: /api/order/verifyStripe
export const verifyStripe = async (req, res) => {
    try {
        const { orderId, success, userId } = req.body;

        if (success === "true") {
            await Order.findByIdAndUpdate(orderId, { isPaid: true });
            await User.findByIdAndUpdate(userId, { cartItems: {} });
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            await Order.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed" });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
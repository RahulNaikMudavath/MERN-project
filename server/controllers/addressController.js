import Address from "../models/Address.js";


//Add Address: /api/address/add
export const addAddress = async(req,res)=>{
    try {
        const {userId, address} = req.body;
        await Address.create({...address, userId});
        res.json({success: true, message: "Address added successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//get user addresses: /api/address/get
export const getAddresses = async(req,res)=>{
    try {
        const {userId} = req.body;
        const addresses = await Address.find({userId});
        res.json({success: true, addresses});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}
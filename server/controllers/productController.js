// import {v2 as cloudinary} from 'cloudinary';
// import Product from '../models/Product.js';


// //Add Product: /api/product/add
// export const addProduct = async(req,res)=>{
//     try {
//         let productData = JSON.parse(req.body.productData);
//         const images = req.files; 
//         let imagesUrl = await Promise.all(images.map(async(item)=>{
//             let result = await cloudinary.uploader.upload(item.path, {resource_type: "image"});
//            return result.secure_url;
//         }))

//         await Product.create({...productData, image: imagesUrl});
//         res.json({success: true, message: "Product added successfully"});

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message});
//     }
// }


// //get product list: /api/product/list
// export const productList = async(req,res)=>{
//     try {
//         const products = await Product.find({})
//         res.json({success: true, products})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message});
//     }

// }

// //get single  Product: /api/product/id
// export const productById = async(req,res)=>{
//     try {
//         const {id} = req.body;
//         const product = await Product.findById(id);
//         res.json({success: true, product})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message});
//     }

// }

// //change product instock : /api/product/stock
// export const changeStock = async(req,res)=>{
//     try {
//         const {id, inStock} = req.body;
//         await Product.findByIdAndUpdate(id, {inStock});
//         res.json({success: true, message: "Product stock status updated successfully"});
        
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message});
        
//     }

// }
import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add Product: /api/product/add
// export const addProduct = async (req, res) => {
//   try {
//     let productData = JSON.parse(req.body.productData);
//     const images = req.files;

//     let imagesUrl = await Promise.all(
//       images.map(async (item) => {
//         let result = await cloudinary.uploader.upload(item.path, {
//           resource_type: "image",
//         });
//         return result.secure_url;
//       })
//     );

//     await Product.create({ ...productData, image: imagesUrl });

//     return res.status(201).json({
//       success: true,
//       message: "Product added successfully",
//     });
//   } catch (error) {
//     console.error("Add product error:", error.message);
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const addProduct = async (req, res) => {
  try {
    if (!req.body.productData) {
      return res.status(400).json({
        success: false,
        message: "No product data provided",
      });
    }

    let productData = JSON.parse(req.body.productData);

    const images = req.files || [];
    let imagesUrl = [];

    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    await Product.create({ ...productData, image: imagesUrl });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Add product error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



// Get product list: /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ success: true, products });
  } catch (error) {
    console.error("Product list error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single Product: /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.json({ success: true, product });
  } catch (error) {
    console.error("Product by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change product instock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    return res.json({
      success: true,
      message: "Product stock status updated successfully",
    });
  } catch (error) {
    console.error("Change stock error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

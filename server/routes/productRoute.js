import express from 'express';
import { uplaod } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';

const productRouter = express.Router();


productRouter.post('/add', uplaod.array(["images"]), authSeller, addProduct);
productRouter.get('/list', productList)
productRouter.get('/id', productById)
productRouter.post('/stock', authSeller, changeStock)


export default productRouter;


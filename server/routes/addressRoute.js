import express from "express";
import authUser from "../middlewares/authUser.js";
import { addAddress, getAddresses } from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress)
addressRouter.post('/get', authUser, getAddresses)

export default addressRouter;

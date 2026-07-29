import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true}, 
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cartItems: {type: Object,default: {}}, // Cart items will be stored as an object
}, {minimize: false, timestamps: true}); // timestamps will add createdAt and updatedAt fields

const User = mongoose.models.user || mongoose.model('user', userSchema)


export default User; // Exporting the User model to be used in other parts of the application

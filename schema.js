import mongoose from 'mongoose';

let regScheme = new mongoose.Schema({
    email: String,
    password: String
});

export default regScheme;
import mongoose from "mongoose";



const connectToDB = async () => {
    const connectionUrl = 'mongodb+srv://ngocle8a8:23102003@cluster0.fzq7v.mongodb.net/';

    mongoose
    .connect(connectionUrl)
    .then(() => console.log('Ecommerce databse connected successfully'))
    .catch((err) => 
        console.log(`Getting Error from DB connection ${err.message}`)
);
}

export default connectToDB;


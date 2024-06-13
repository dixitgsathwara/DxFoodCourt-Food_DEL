import userModel from "../Models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User Does Not Exist" });
        }
        if (await bcrypt.compare(password, user.password)) {
            const id = user._id;
            const accesstoken = jwt.sign(
                { id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30m" }
            );
            res.json({ success: true, accesstoken });
        }
        else {
            return res.json({ success: false, message: "Passwors Does Not Match" });

        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}
const userRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "This Email Is Already Exist" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter A Valid Email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please Enter A Strong Password" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashPassword,
        });
        const user = await newUser.save();
        const id = user._id;
        const accesstoken = jwt.sign(
            { id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
        );
        res.json({ success: true, accesstoken });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}
export { userLogin, userRegister }
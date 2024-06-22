import userModel from "../Models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import nodemailer from 'nodemailer'
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
const getInfo = async (req, res) => {
    res.json({ success: true });
}
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            const frontend_url = "http://localhost:5173";
            const id = exists._id;
            const accesstoken = jwt.sign(
                { id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10m" }
            );
            const url = `${frontend_url}/forgot?token=${accesstoken}`
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Update Password',
                text: `Hello ${exists.name},\n\n ${url},\n\n This is the url..for update password click the url and update your password`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.send({ success: false, message: error.message });
                }
                return res.send({ success: true, message: "Update password link send through email" });
            });
        } else {
            return res.json({ success: false, message: "This email does not registered" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}
const updatePassword = async (req, res) => {
    const { password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        await userModel.findByIdAndUpdate(req.body.userId, { password: hashPassword });
        res.json({ success: true, message: "Password update successfully.." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}
export { userLogin, userRegister, getInfo, forgotPassword, updatePassword }
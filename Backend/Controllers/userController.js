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
            return res.json({ success: false, message: "Passwords Does Not Match" });

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
                subject: 'Reset your dxfoodcourt account Password',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Hello ${exists.name},</h2>
                        <p>We received a request to reset the password for your dxfoodcourt account.</p>
                        <p>To update your password, click the button below:</p>
                        <p>
                            <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                        </p>
                        <p>If you did not request a password reset, please ignore this email.</p>
                        <p>Thanks,<br>The dxfoodcourt Team</p>
                    </div>
                `
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

const googleLogin = async (req, res) => {
    const { name, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            const id = exists._id;
            const accesstoken = jwt.sign(
                { id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30m" }
            );
            res.json({ success: true, accesstoken });
        }
        else {
            const hashPassword = await bcrypt.hash("123456789", 10);
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
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }

}
export { userLogin, userRegister, getInfo, forgotPassword, updatePassword, googleLogin }
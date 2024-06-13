import jwt from "jsonwebtoken";
const validateToken = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        console.log("invalid token")
        return res.json({ success: false, message: "Not authorize login again" })
    }
    try {
        const token_decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        return res.json({ success: false, message: "Token is invalid or expires" })
    }
};
export default validateToken;
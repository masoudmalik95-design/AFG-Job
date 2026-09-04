import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "لطفاً ابتدا وارد حساب کاربری خود شوید",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "کاربر پیدا نشد",
      });
    }

    req.userData = user;

    next();
  } catch (error) {
    console.error("User authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "ورود شما معتبر نیست، لطفاً دوباره وارد شوید",
    });
  }
};

export default userAuthMiddleware;
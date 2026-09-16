import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

const companyAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "لطفاً دوباره وارد حساب شرکت شوید",
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const company = await Company.findById(decodedToken.id).select(
      "-password"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "شرکت پیدا نشد",
      });
    }

    req.companyData = company;

    next();
  } catch (error) {
    console.error("Company auth error:", error);

    return res.status(401).json({
      success: false,
      message: "احراز هویت انجام نشد، لطفاً دوباره وارد شوید",
    });
  }
};

export default companyAuthMiddleware;
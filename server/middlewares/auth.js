import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";

const isAuthenticated = (req, res, next) => {
  const token = req.cookies["chattu-token"];
  if (!token) return next(new ErrorHandler("No token provided", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decodedData.userId;
  next();
};

const adminOnly = (req, res, next) => {
  const token = req.cookies["chattu-admin-token"];
  if (!token) return next(new ErrorHandler("No token provided", 401));

  const adminID = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = adminID === adminSecretKey;
  if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));
  next();
};

export { isAuthenticated, adminOnly };

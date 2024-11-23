import { envMode } from "../app.js";

const errorMiddleware = (err, req, res, next) => {
  err.message ||= "Interval Server Error";
  err.statusCode ||= 500;

  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = `Duplicate field - ${Object.keys(err.keyPattern).join(",")}`;
  }

  if (err.name === "CastError") {
    err.message = `Invalid format of ${err.path}`;
    err.statusCode = 400;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: envMode === "DEVELOPMENT" ? err.message : err.message,
  });
};

const TryCatch = (passedFunc) => async (req, res, next) => {
  try {
    await passedFunc(req, res, next);
  } catch (e) {
    next(e);
  }
};

export { errorMiddleware, TryCatch };

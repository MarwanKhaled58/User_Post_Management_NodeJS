const APIError = require("./../utils/APIError");

const errorMiddleware = (err, req, res, next) => {

  console.error(err.stack);

  
  if (err.name === "CastError") {
    res.status(400).json({ message: "Invalid ID" });
  }
  
  if (err.name === "ValidationError") {
    res.status(400).json({ message: "Invalid Data" });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `Duplicate value for ${field}`,
    });
  }
 

  
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (err instanceof APIError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }

  
  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message,
  });
};

module.exports = errorMiddleware;

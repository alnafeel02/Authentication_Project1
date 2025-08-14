import jwt from 'jsonwebtoken';
import dot from 'dotenv';
dot.config().parsed

const userAuth = async (req, res, next) => {
  const {token} = req.cookies;
 

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }
  console.log("Token received:", token);
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", tokenDecoded.id);
    if (tokenDecoded.id) {
      req.userId = tokenDecoded.id; 
      console.log("User authenticated:", req.userId);
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    next();
     // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
}

export default userAuth;
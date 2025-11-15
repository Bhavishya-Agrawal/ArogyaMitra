import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers.authorization || req.headers.token;
  if (!header) return res.status(401).json({ message: "No token provided" });

  // Support "Bearer <token>" or raw token in 'token' header
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export const protect = (req, res, next) => {
  req.user = { _id: "TEST_USER_123" }; // no JWT needed for now
  next();
};


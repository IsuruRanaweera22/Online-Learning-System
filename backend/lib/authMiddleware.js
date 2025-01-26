import { auth } from "./firebaseAdmin"; // Firebase Admin auth instance

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1]; // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // Add the decoded token data to the request object (e.g., user ID, role)
    next(); // Call the next middleware or API route handler
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}; 
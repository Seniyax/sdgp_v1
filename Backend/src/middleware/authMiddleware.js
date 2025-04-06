const supabaseService = require("../config/supabaseService");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Auth middleware: No token provided");
    return res.status(401).json({ error: "Missing or invalid auth token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await supabaseService.auth.getUser(token);
    if (error || !user) {
      console.log("Auth middleware: Token verification failed", error);
      return res.status(401).json({ error: "Invalid token" });
    }
    console.log(
      `Auth middleware: Token verified successfully for user ${user.email}`
    );
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware: Error verifying token:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;

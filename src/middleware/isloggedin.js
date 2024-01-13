const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  // Verify the token
  const jwtSecret = process.env.JWT_SECRET || "tested";
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    if (err) {
      // If there's an error in verifying the token, user is not authenticated
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decodedToken; // Fix the typo here

    // If the user is already authenticated, redirect them to "/admin"
    if (req.path === "/admin/login" || req.path === "/admin") {
      return res.redirect("/admin");
    }

    // If the user is not authenticated and trying to access a page other than login, continue to the next middleware or route handler
    next();
  });
};

module.exports = authMiddleware;

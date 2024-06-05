import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
  res.status(200).json({
    message: "You are logged in",
  });
};
export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.Session;

  if (!token) {
    return res.status(401).json({
      message: "You are not logged in",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(403).json({
        message: "Token is not valid",
      });
    }

    if (!payload.isAdmin) {
      return res.status(403).json({
        message: "You are not an admin",
      });
    }
  });

  res.status(200).json({
    message: "You are logged in",
  });
};

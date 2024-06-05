import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
    });
  }
};
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // send jwt token through cookie

    const age = 1000 * 60 * 60 * 24;
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: false,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: age,
      }
    );

    const { password: userPassword, ...userInfo } = user;
    res
      .cookie("Session", token, {
        httpOnly: true,
        //  secure: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
    });
  }
};
export const logout = (req, res) => {
  res.clearCookie("Session").status(200).json({ message: "Logout successful" });
};

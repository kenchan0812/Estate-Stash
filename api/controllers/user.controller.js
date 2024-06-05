import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...body } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "You are not authorized" });
  }
  let hashedPassword = null;
  try {
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...body,
        ...(hashedPassword && { password: hashedPassword }),
        ...(avatar && { avatar }),
      },
    });
    const { password: userPassword, ...user } = updatedUser;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "You are not authorized" });
  }

  try {
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};
export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const userId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          postId,
          userId: userId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved" });
    } else {
      await prisma.savedPost.create({
        data: {
          postId,
          userId: userId,
        },
      });
      res.status(200).json({ message: "Post saved successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const profilePosts = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: userId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: userId },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((post) => post.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts" });
  }
};

export const getNotification = async (req, res) => {
  const userId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          has: userId,
        },
        NOT: {
          seenBy: {
            hasSome: [userId],
          },
        },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts" });
  }
};

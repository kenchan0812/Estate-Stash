import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
export const getPosts = async (req, res) => {
  const query = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 10000000000,
        },
        bedroom: parseInt(query.bedroom) || undefined,
      },
    });
    const convertedPosts = posts.map((post) => ({
      ...post,
      latitude: parseFloat(post.latitude),
      longitude: parseFloat(post.longitude),
    }));
    res.status(200).json(convertedPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    const convertedPosts = {
      ...post,
      latitude: parseFloat(post.latitude),
      longitude: parseFloat(post.longitude),
    };
    let userId = null;
    const token = req.cookies?.Session;
    if (token) {
      try {
        const payload = await new Promise((resolve, reject) => {
          jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
              reject(err);
            } else {
              resolve(decoded);
            }
          });
        });
        userId = payload.id;
      } catch (err) {
        userId = null;
      }
    }
    const saved = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          postId: id,
          userId,
        },
      },
    });
    res.status(200).json({ ...convertedPosts, isSaved: saved ? true : false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};
export const addPost = async (req, res) => {
  const body = req.body;
  const userId = req.userId;
  const postData = {
    ...body.postData,
    price: parseInt(body.postData.price),
    bedroom: parseInt(body.postData.bedroom),
    bathroom: parseInt(body.postData.bathroom),
  };
  const postDetailData = {
    ...body.postDetail,
    size: body.postDetail.size ? parseInt(body.postDetail.size) : undefined,
    school: body.postDetail.school
      ? parseInt(body.postDetail.school)
      : undefined,
    bus: body.postDetail.bus ? parseInt(body.postDetail.bus) : undefined,
    restaurant: body.postDetail.restaurant
      ? parseInt(body.postDetail.restaurant)
      : undefined,
  };
  try {
    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userId: userId,
        postDetail: {
          create: postDetailData,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add post" });
  }
};
export const updatePost = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (post.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized" });
    }
    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

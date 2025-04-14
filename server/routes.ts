import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPostSchema, insertCommentSchema, insertLikeSchema, insertFollowSchema, User } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Error handler for Zod validation errors
  const handleZodError = (error: unknown, res: any) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    throw error;
  };

  // Posts API endpoints
  app.get("/api/posts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const posts = await storage.getPosts(limit, offset);
      
      // Enhance posts with user data and counts
      const enhancedPosts = await Promise.all(
        posts.map(async (post) => {
          const user = await storage.getUser(post.userId);
          const likesCount = (await storage.getPostLikes(post.id)).length;
          const commentsCount = (await storage.getPostComments(post.id)).length;
          
          let hasLiked = false;
          if (req.isAuthenticated()) {
            hasLiked = await storage.hasUserLikedPost(req.user!.id, post.id);
          }
          
          return {
            ...post,
            user: user ? { 
              id: user.id, 
              displayName: user.displayName, 
              username: user.username,
              avatar: user.avatar,
              userType: user.userType
            } : null,
            likesCount,
            commentsCount,
            hasLiked
          };
        })
      );
      
      res.json(enhancedPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  
  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const postData = insertPostSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const post = await storage.createPost(postData);
      const user = await storage.getUser(post.userId);
      
      res.status(201).json({
        ...post,
        user: user ? { 
          id: user.id, 
          displayName: user.displayName, 
          username: user.username,
          avatar: user.avatar,
          userType: user.userType
        } : null,
        likesCount: 0,
        commentsCount: 0,
        hasLiked: false
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPostWithDetails(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      let hasLiked = false;
      if (req.isAuthenticated()) {
        hasLiked = await storage.hasUserLikedPost(req.user!.id, postId);
      }
      
      res.json({
        ...post,
        hasLiked
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });
  
  // Comments API
  app.post("/api/posts/:postId/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const postId = parseInt(req.params.postId);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const commentData = insertCommentSchema.parse({
        content: req.body.content,
        userId: req.user!.id,
        postId
      });
      
      const comment = await storage.createComment(commentData);
      const user = await storage.getUser(comment.userId);
      
      res.status(201).json({
        ...comment,
        user: user ? { 
          id: user.id, 
          displayName: user.displayName, 
          username: user.username,
          avatar: user.avatar,
          userType: user.userType
        } : null
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getPostComments(postId);
      
      const enhancedComments = await Promise.all(
        comments.map(async (comment) => {
          const user = await storage.getUser(comment.userId);
          return {
            ...comment,
            user: user ? { 
              id: user.id, 
              displayName: user.displayName, 
              username: user.username,
              avatar: user.avatar,
              userType: user.userType
            } : null
          };
        })
      );
      
      res.json(enhancedComments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  
  // Likes API
  app.post("/api/posts/:postId/likes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const postId = parseInt(req.params.postId);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const likeData = insertLikeSchema.parse({
        userId: req.user!.id,
        postId
      });
      
      const like = await storage.createLike(likeData);
      const likesCount = (await storage.getPostLikes(postId)).length;
      
      res.status(201).json({
        ...like,
        likesCount
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to like post" });
    }
  });
  
  app.delete("/api/posts/:postId/likes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const postId = parseInt(req.params.postId);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      await storage.deleteLike(req.user!.id, postId);
      const likesCount = (await storage.getPostLikes(postId)).length;
      
      res.json({ likesCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });
  
  // Follow API
  app.post("/api/users/:userId/follow", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const followingId = parseInt(req.params.userId);
      const userToFollow = await storage.getUser(followingId);
      
      if (!userToFollow) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (followingId === req.user!.id) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }
      
      const followData = insertFollowSchema.parse({
        followerId: req.user!.id,
        followingId
      });
      
      const follow = await storage.createFollow(followData);
      const followersCount = await storage.getFollowersCount(followingId);
      
      res.status(201).json({
        ...follow,
        followersCount
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      res.status(500).json({ message: "Failed to follow user" });
    }
  });
  
  app.delete("/api/users/:userId/follow", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const followingId = parseInt(req.params.userId);
      const userToUnfollow = await storage.getUser(followingId);
      
      if (!userToUnfollow) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.deleteFollow(req.user!.id, followingId);
      const followersCount = await storage.getFollowersCount(followingId);
      
      res.json({ followersCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });
  
  // User profile API
  app.get("/api/users/:username", async (req, res) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const followersCount = await storage.getFollowersCount(user.id);
      const followingCount = await storage.getFollowingCount(user.id);
      
      let isFollowing = false;
      if (req.isAuthenticated()) {
        isFollowing = await storage.isFollowing(req.user!.id, user.id);
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        ...userWithoutPassword,
        followersCount,
        followingCount,
        isFollowing
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  
  // Update user profile customization
  app.patch("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userId = parseInt(req.params.id);
      
      if (req.user!.id !== userId) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Only allow updating customization fields
      const allowedFields = [
        'primaryColor', 
        'secondaryColor',
        'accentColor',
        'logo',
        'coverImage',
        'customTheme',
        'customCSS'
      ];
      
      const updateData = {} as Partial<typeof user>;
      
      for (const field of allowedFields) {
        if (field in req.body) {
          updateData[field as keyof typeof updateData] = req.body[field];
        }
      }
      
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile customization" });
    }
  });
  
  app.get("/api/users/:username/posts", async (req, res) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const posts = await storage.getUserPosts(user.id);
      
      // Enhance posts with counts
      const enhancedPosts = await Promise.all(
        posts.map(async (post) => {
          const likesCount = (await storage.getPostLikes(post.id)).length;
          const commentsCount = (await storage.getPostComments(post.id)).length;
          
          let hasLiked = false;
          if (req.isAuthenticated()) {
            hasLiked = await storage.hasUserLikedPost(req.user!.id, post.id);
          }
          
          return {
            ...post,
            user: { 
              id: user.id, 
              displayName: user.displayName, 
              username: user.username,
              avatar: user.avatar,
              userType: user.userType
            },
            likesCount,
            commentsCount,
            hasLiked
          };
        })
      );
      
      res.json(enhancedPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

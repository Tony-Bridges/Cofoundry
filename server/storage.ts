import { users, User, InsertUser, posts, Post, InsertPost, comments, Comment, InsertComment, 
  likes, Like, InsertLike, follows, Follow, InsertFollow, startups, Startup, InsertStartup } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User-related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getUserFollowers(userId: number): Promise<User[]>;
  getUserFollowing(userId: number): Promise<User[]>;

  // Startup-related methods
  getStartup(id: number): Promise<Startup | undefined>;
  getStartupByFounderId(founderId: number): Promise<Startup | undefined>;
  createStartup(startup: InsertStartup): Promise<Startup>;
  updateStartup(id: number, startup: Partial<Startup>): Promise<Startup | undefined>;

  // Post-related methods
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  getPosts(limit?: number, offset?: number): Promise<Post[]>;
  getUserPosts(userId: number): Promise<Post[]>;
  getPostsByType(type: string, limit?: number): Promise<Post[]>;
  getPostWithDetails(postId: number): Promise<any>;

  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: number): Promise<Comment[]>;

  // Likes
  createLike(like: InsertLike): Promise<Like>;
  deleteLike(userId: number, postId: number): Promise<void>;
  getPostLikes(postId: number): Promise<Like[]>;
  hasUserLikedPost(userId: number, postId: number): Promise<boolean>;

  // Follows
  createFollow(follow: InsertFollow): Promise<Follow>;
  deleteFollow(followerId: number, followingId: number): Promise<void>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  getFollowersCount(userId: number): Promise<number>;
  getFollowingCount(userId: number): Promise<number>;

  // Session store for auth
  sessionStore: session.SessionStore;
}

import { db } from './firebase';
import { ref, set, get, remove } from 'firebase/database';

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private startupsData: Map<number, Startup>;
  private postsData: Map<number, Post>;
  private commentsData: Map<number, Comment>;
  private likesData: Map<number, Like>;
  private followsData: Map<number, Follow>;

  userIdCounter: number;
  startupIdCounter: number;
  postIdCounter: number;
  commentIdCounter: number;
  likeIdCounter: number;
  followIdCounter: number;

  sessionStore: session.SessionStore;

  constructor() {
    this.usersData = new Map();
    this.startupsData = new Map();
    this.postsData = new Map();
    this.commentsData = new Map();
    this.likesData = new Map();
    this.followsData = new Map();

    // Create test users
    const testUsers = [
      {
        username: "founder1",
        password: "$2b$10$dVEDqKgGPZp/IbCPRxgVn.YX6r5B6RvP.yWyJhJ0QmGfdv/FbYK6O", // "password123"
        displayName: "John Smith",
        email: "john@example.com",
        userType: "founder",
        bio: "Serial entrepreneur, building the future",
        isPremium: true
      },
      {
        username: "founder2",
        password: "$2b$10$dVEDqKgGPZp/IbCPRxgVn.YX6r5B6RvP.yWyJhJ0QmGfdv/FbYK6O", // "password123"
        displayName: "Sarah Johnson",
        email: "sarah@example.com",
        userType: "founder",
        bio: "Tech founder passionate about AI",
        isPremium: false
      },
      {
        username: "investor1",
        password: "$2b$10$dVEDqKgGPZp/IbCPRxgVn.YX6r5B6RvP.yWyJhJ0QmGfdv/FbYK6O", // "password123"
        displayName: "Mike Anderson",
        email: "mike@example.com",
        userType: "investor",
        bio: "Angel investor focused on deep tech",
        isPremium: true
      },
      {
        username: "investor2",
        password: "$2b$10$dVEDqKgGPZp/IbCPRxgVn.YX6r5B6RvP.yWyJhJ0QmGfdv/FbYK6O", // "password123"
        displayName: "Lisa Chen",
        email: "lisa@example.com",
        userType: "investor",
        bio: "VC Partner investing in Web3",
        isPremium: false
      },
      {
        username: "startup1",
        password: "$2b$10$dVEDqKgGPZp/IbCPRxgVn.YX6r5B6RvP.yWyJhJ0QmGfdv/FbYK6O", // "password123"
        displayName: "TechCorp",
        email: "contact@techcorp.com",
        userType: "startup",
        bio: "Building the next generation platform",
        isPremium: true
      },
      {
        username: "startup2",
        password: "$2b$10$dVEDqKgGPZp/IbCPRxgVn.YX6r5B6RvP.yWyJhJ0QmGfdv/FbYK6O", // "password123"
        displayName: "InnovateLabs",
        email: "team@innovatelabs.com",
        userType: "startup",
        bio: "Innovation at scale",
        isPremium: false
      }
    ];

    testUsers.forEach((user, index) => {
      const id = index + 1;
      this.usersData.set(id, {
        ...user,
        id,
        createdAt: new Date(),
        role: "user",
        pressureGauge: 5
      });
    });

    this.userIdCounter = testUsers.length + 1;
    this.startupIdCounter = 1;
    this.postIdCounter = 1;
    this.commentIdCounter = 1;
    this.likeIdCounter = 1;
    this.followIdCounter = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.usersData.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }

  async getUserFollowers(userId: number): Promise<User[]> {
    const followerIds = Array.from(this.followsData.values())
      .filter(follow => follow.followingId === userId)
      .map(follow => follow.followerId);

    return followerIds.map(id => this.usersData.get(id)!).filter(Boolean);
  }

  async getUserFollowing(userId: number): Promise<User[]> {
    const followingIds = Array.from(this.followsData.values())
      .filter(follow => follow.followerId === userId)
      .map(follow => follow.followingId);

    return followingIds.map(id => this.usersData.get(id)!).filter(Boolean);
  }

  // Startup methods
  async getStartup(id: number): Promise<Startup | undefined> {
    return this.startupsData.get(id);
  }

  async getStartupByFounderId(founderId: number): Promise<Startup | undefined> {
    return Array.from(this.startupsData.values()).find(
      (startup) => startup.founderId === founderId,
    );
  }

  async createStartup(insertStartup: InsertStartup): Promise<Startup> {
    const id = this.startupIdCounter++;
    const createdAt = new Date();
    const startup: Startup = { ...insertStartup, id, createdAt };
    this.startupsData.set(id, startup);
    return startup;
  }

  async updateStartup(id: number, startupData: Partial<Startup>): Promise<Startup | undefined> {
    const startup = await this.getStartup(id);
    if (!startup) return undefined;

    const updatedStartup = { ...startup, ...startupData };
    this.startupsData.set(id, updatedStartup);
    return updatedStartup;
  }

  // Post methods
  async getPost(id: number): Promise<Post | undefined> {
    return this.postsData.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const createdAt = new Date();
    const post: Post = { ...insertPost, id, createdAt };
    this.postsData.set(id, post);
    return post;
  }

  async getPosts(limit: number = 20, offset: number = 0): Promise<Post[]> {
    return Array.from(this.postsData.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.postsData.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPostsByType(type: string, limit: number = 10): Promise<Post[]> {
    return Array.from(this.postsData.values())
      .filter(post => post.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getPostWithDetails(postId: number): Promise<any> {
    const post = await this.getPost(postId);
    if (!post) return null;

    const user = await this.getUser(post.userId);
    const comments = await this.getPostComments(postId);
    const likes = await this.getPostLikes(postId);

    const commentsWithUser = await Promise.all(
      comments.map(async (comment) => {
        const commentUser = await this.getUser(comment.userId);
        return {
          ...comment,
          user: commentUser,
        };
      })
    );

    return {
      ...post,
      user,
      comments: commentsWithUser,
      likesCount: likes.length,
      commentsCount: comments.length,
    };
  }

  // Comment methods
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const createdAt = new Date();
    const comment: Comment = { ...insertComment, id, createdAt };
    this.commentsData.set(id, comment);
    return comment;
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    return Array.from(this.commentsData.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  // Like methods
  async createLike(insertLike: InsertLike): Promise<Like> {
    // Check if already liked
    const existing = Array.from(this.likesData.values()).find(
      like => like.userId === insertLike.userId && like.postId === insertLike.postId
    );

    if (existing) return existing;

    const id = this.likeIdCounter++;
    const createdAt = new Date();
    const like: Like = { ...insertLike, id, createdAt };
    this.likesData.set(id, like);
    return like;
  }

  async deleteLike(userId: number, postId: number): Promise<void> {
    const likeToDelete = Array.from(this.likesData.values()).find(
      like => like.userId === userId && like.postId === postId
    );

    if (likeToDelete) {
      this.likesData.delete(likeToDelete.id);
    }
  }

  async getPostLikes(postId: number): Promise<Like[]> {
    return Array.from(this.likesData.values())
      .filter(like => like.postId === postId);
  }

  async hasUserLikedPost(userId: number, postId: number): Promise<boolean> {
    return !!Array.from(this.likesData.values()).find(
      like => like.userId === userId && like.postId === postId
    );
  }

  // Follow methods
  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    // Check if already following
    const existing = Array.from(this.followsData.values()).find(
      follow => follow.followerId === insertFollow.followerId && 
               follow.followingId === insertFollow.followingId
    );

    if (existing) return existing;

    const id = this.followIdCounter++;
    const createdAt = new Date();
    const follow: Follow = { ...insertFollow, id, createdAt };
    this.followsData.set(id, follow);
    return follow;
  }

  async deleteFollow(followerId: number, followingId: number): Promise<void> {
    const followToDelete = Array.from(this.followsData.values()).find(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );

    if (followToDelete) {
      this.followsData.delete(followToDelete.id);
    }
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    return !!Array.from(this.followsData.values()).find(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
  }

  async getFollowersCount(userId: number): Promise<number> {
    return Array.from(this.followsData.values())
      .filter(follow => follow.followingId === userId)
      .length;
  }

  async getFollowingCount(userId: number): Promise<number> {
    return Array.from(this.followsData.values())
      .filter(follow => follow.followerId === userId)
      .length;
  }
}

export const storage = new MemStorage();
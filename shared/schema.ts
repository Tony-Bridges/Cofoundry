import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// USER RELATED SCHEMAS
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  avatar: text("avatar"),
  userType: text("user_type").notNull().default("founder"), // founder, investor, startup
  isPremium: boolean("is_premium").default(false),
  role: text("role").default("user"), // user, moderator, admin
  pressureGauge: integer("pressure_gauge").default(5), // BuildPublic tool - 1-10 scale
  
  // Customization fields
  primaryColor: text("primary_color"), // HEX code for primary brand color
  secondaryColor: text("secondary_color"), // HEX code for secondary brand color
  accentColor: text("accent_color"), // HEX code for accent color
  logo: text("logo"), // URL for brand logo
  coverImage: text("cover_image"), // URL for profile cover image
  customTheme: text("custom_theme").default("default"), // theme name: default, dark, light, custom
  customCSS: text("custom_css"), // Limited custom CSS for advanced users
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const startups = pgTable("startups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logo: text("logo"),
  website: text("website"),
  industry: text("industry"),
  stage: text("stage"), // ideation, seed, growth, etc.
  founderId: integer("founder_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull(),
  followingId: integer("following_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// POST RELATED SCHEMAS
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  type: text("type").default("regular"), // regular, milestone, sos, launch
  mediaUrl: text("media_url"),
  pressureGauge: integer("pressure_gauge"), // for SOS posts
  milestoneTitle: text("milestone_title"), // for milestone posts
  milestoneDate: text("milestone_date"), // for milestone posts
  launchTitle: text("launch_title"), // for launch posts
  launchUrl: text("launch_url"), // for launch posts
  createdAt: timestamp("created_at").defaultNow(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  postId: integer("post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  postId: integer("post_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const postTags = pgTable("post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  tagId: integer("tag_id").notNull(),
});

// INSERT SCHEMAS
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  userType: true,
  bio: true,
  avatar: true,
  primaryColor: true,
  secondaryColor: true,
  accentColor: true,
  logo: true,
  coverImage: true,
  customTheme: true,
  customCSS: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

export const insertStartupSchema = createInsertSchema(startups).pick({
  name: true,
  description: true,
  logo: true,
  website: true,
  industry: true,
  stage: true,
  founderId: true,
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
  type: true,
  mediaUrl: true,
  pressureGauge: true,
  milestoneTitle: true,
  milestoneDate: true,
  launchTitle: true,
  launchUrl: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  userId: true,
  postId: true,
  content: true,
});

export const insertLikeSchema = createInsertSchema(likes).pick({
  userId: true,
  postId: true,
});

export const insertFollowSchema = createInsertSchema(follows).pick({
  followerId: true,
  followingId: true,
});

// TYPES
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type Startup = typeof startups.$inferSelect;
export type InsertStartup = z.infer<typeof insertStartupSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Like = typeof likes.$inferSelect;
export type InsertLike = z.infer<typeof insertLikeSchema>;

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = z.infer<typeof insertFollowSchema>;

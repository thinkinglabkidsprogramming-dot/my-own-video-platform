import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

export const courses = sqliteTable("courses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailPath: text("thumbnail_path"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const chapters = sqliteTable("chapters", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const lessons = sqliteTable("lessons", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chapterId: text("chapter_id")
    .notNull()
    .references(() => chapters.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  youtubeVideoId: text("youtube_video_id").notNull(),
  durationSeconds: integer("duration_seconds"),
  orderIndex: integer("order_index").notNull().default(0),
});

export const userProgress = sqliteTable("user_progress", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lessonId: text("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  isCompleted: integer("is_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

// Relations
export const coursesRelations = relations(courses, ({ many }) => ({
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  course: one(courses, { fields: [chapters.courseId], references: [courses.id] }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  chapter: one(chapters, { fields: [lessons.chapterId], references: [chapters.id] }),
  progress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
  lesson: one(lessons, { fields: [userProgress.lessonId], references: [lessons.id] }),
}));

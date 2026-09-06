import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isAdmin, now } from "./helpers";

const blogFields = {
  slug: v.string(),
  title: v.string(),
  date: v.number(),
  summary: v.string(),
  body: v.string(),
  published: v.boolean(),
};

// Public queries ------------------------------------------------------------

/** Published posts, newest first. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("blogPosts").collect();
    return rows
      .filter((p) => p.published)
      .sort((a, b) => b.date - a.date)
      .map((p) => ({
        _id: p._id,
        slug: p.slug,
        title: p.title,
        date: p.date,
        summary: p.summary,
      }));
  },
});

/** Full published post. */
export const get = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const rows = await ctx.db.query("blogPosts").collect();
    const row = rows.find((p) => p.slug === slug && p.published);
    return row ?? null;
  },
});

// Admin mutations -----------------------------------------------------------

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Admin only.");
    }
    const rows = await ctx.db.query("blogPosts").collect();
    return rows.sort((a, b) => b.date - a.date);
  },
});

export const save = mutation({
  args: { id: v.optional(v.id("blogPosts")), ...blogFields },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Admin only.");
    }
    const stamp = now();
    const { id, ...fields } = args;
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing) {
        throw new Error("Post not found.");
      }
      await ctx.db.patch(id, { ...fields, updatedAt: stamp });
      return id;
    }
    return await ctx.db.insert("blogPosts", {
      ...fields,
      createdAt: stamp,
      updatedAt: stamp,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, { id }) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Admin only.");
    }
    await ctx.db.delete(id);
  },
});

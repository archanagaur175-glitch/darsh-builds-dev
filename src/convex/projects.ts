import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isAdmin, now } from "./helpers";

const projectFields = {
  slug: v.string(),
  title: v.string(),
  summary: v.string(),
  architecture: v.string(),
  stack: v.array(v.string()),
  repoOwner: v.string(),
  repoName: v.string(),
  demoUrl: v.optional(v.string()),
  docsUrl: v.optional(v.string()),
  featured: v.boolean(),
  scaffold: v.boolean(),
  published: v.boolean(),
  order: v.number(),
};

// Public queries ------------------------------------------------------------

/** Published projects in showcase order (card fields, no architecture body). */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("projects").collect();
    return rows
      .filter((p) => p.published)
      .sort((a, b) => a.order - b.order)
      .map((p) => ({
        _id: p._id,
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        stack: p.stack,
        repoOwner: p.repoOwner,
        repoName: p.repoName,
        demoUrl: p.demoUrl,
        docsUrl: p.docsUrl,
        featured: p.featured,
        scaffold: p.scaffold,
        documented: p.documented !== false,
        order: p.order,
        updatedAt: p.updatedAt,
      }));
  },
});

/** Full published project, including the architecture markdown body. */
export const get = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const rows = await ctx.db.query("projects").collect();
    const row = rows.find((p) => p.slug === slug && p.published);
    if (!row) return null;
    return { ...row, documented: row.documented !== false };
  },
});

// Admin mutations -----------------------------------------------------------

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Admin only.");
    }
    const rows = await ctx.db.query("projects").collect();
    return rows
      .sort((a, b) => a.order - b.order)
      .map((p) => ({ ...p, documented: p.documented !== false }));
  },
});

export const save = mutation({
  args: {
    id: v.optional(v.id("projects")),
    documented: v.optional(v.boolean()),
    ...projectFields,
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Admin only.");
    }
    const stamp = now();
    const { id, documented, ...fields } = args;
    // Legacy rows stored before the flag existed default to documented.
    const flag = documented ?? true;
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing) {
        throw new Error("Project not found.");
      }
      await ctx.db.patch(id, { ...fields, documented: flag, updatedAt: stamp });
      return id;
    }
    return await ctx.db.insert("projects", {
      ...fields,
      documented: flag,
      createdAt: stamp,
      updatedAt: stamp,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Admin only.");
    }
    await ctx.db.delete(id);
  },
});

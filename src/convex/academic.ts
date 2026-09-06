import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { academicKindValidator } from "./schema";
import { isAdmin, now } from "./helpers";

const academicFields = {
  slug: v.string(),
  kind: academicKindValidator,
  title: v.string(),
  institution: v.string(),
  context: v.optional(v.string()),
  year: v.string(),
  concepts: v.array(v.string()),
  abstract: v.optional(v.string()),
  artifacts: v.array(
    v.object({
      label: v.string(),
      url: v.string(),
    }),
  ),
  published: v.boolean(),
  order: v.number(),
};

// Public queries ------------------------------------------------------------

/** Published academic entries in order. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("academicEntries").collect();
    return rows
      .filter((e) => e.published)
      .sort((a, b) => a.order - b.order);
  },
});

// Admin mutations -----------------------------------------------------------

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Admin only.");
    }
    const rows = await ctx.db.query("academicEntries").collect();
    return rows.sort((a, b) => a.order - b.order);
  },
});

export const save = mutation({
  args: { id: v.optional(v.id("academicEntries")), ...academicFields },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Admin only.");
    }
    const stamp = now();
    const { id, ...fields } = args;
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing) {
        throw new Error("Academic entry not found.");
      }
      await ctx.db.patch(id, { ...fields, updatedAt: stamp });
      return id;
    }
    return await ctx.db.insert("academicEntries", {
      ...fields,
      createdAt: stamp,
      updatedAt: stamp,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("academicEntries") },
  handler: async (ctx, { id }) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Admin only.");
    }
    await ctx.db.delete(id);
  },
});

import { mutation, query } from "./_generated/server";
import { starterAcademic, starterBlog, starterProjects } from "./contentSeed";
import { ROLES } from "./schema";
import { SITE_ADMIN_EMAIL } from "./site";
import { currentEmail, isAdmin, now } from "./helpers";
import { getCurrentUser } from "./users";

/** State the /admin page needs on load. Never throws for signed-out users. */
export const overview = query({
  args: {},
  handler: async (ctx) => {
    const email = await currentEmail(ctx);
    const admin = await isAdmin(ctx);
    const projects = (await ctx.db.query("projects").collect()).length;
    const academic = (await ctx.db.query("academicEntries").collect()).length;
    const blog = (await ctx.db.query("blogPosts").collect()).length;
    return {
      email,
      isAdmin: admin,
      isOwnerEmail: email === SITE_ADMIN_EMAIL,
      counts: { projects, academic, blog },
    };
  },
});

/**
 * Single-owner handoff: the first verified account whose email matches the
 * site owner email takes the admin role. Later claims are rejected, so a
 * public visitor cannot promote themselves.
 */
export const claimAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const me = await getCurrentUser(ctx);
    if (!me?.email) {
      throw new Error("Sign in with the owner email first.");
    }
    const admins = (await ctx.db.query("users").collect()).filter(
      (u) => u.role === ROLES.ADMIN,
    );
    if (admins.length > 0) {
      if (admins[0]._id === me._id) {
        return { claimed: false, message: "Admin role is already active." };
      }
      throw new Error("The admin role is already claimed by another account.");
    }
    if (me.email !== SITE_ADMIN_EMAIL) {
      throw new Error(
        "This email is not the site owner email, so it cannot claim admin.",
      );
    }
    await ctx.db.patch(me._id, { role: ROLES.ADMIN });
    return { claimed: true, message: "Admin role granted." };
  },
});

/**
 * Load the starter content set. Guarded to the owner email or an active
 * admin, and only inserts into tables that are still empty, so it can never
 * overwrite or duplicate existing edits.
 */
export const seedContent = mutation({
  args: {},
  handler: async (ctx) => {
    const allowed =
      (await isAdmin(ctx)) || (await currentEmail(ctx)) === SITE_ADMIN_EMAIL;
    if (!allowed) {
      throw new Error("Owner only.");
    }
    const stamp = now();
    let projects = 0;
    let academic = 0;
    let blog = 0;

    if ((await ctx.db.query("projects").collect()).length === 0) {
      for (const p of starterProjects) {
        await ctx.db.insert("projects", {
          ...p,
          createdAt: stamp,
          updatedAt: stamp,
        });
        projects += 1;
      }
    }
    if ((await ctx.db.query("academicEntries").collect()).length === 0) {
      for (const a of starterAcademic) {
        await ctx.db.insert("academicEntries", {
          ...a,
          createdAt: stamp,
          updatedAt: stamp,
        });
        academic += 1;
      }
    }
    if ((await ctx.db.query("blogPosts").collect()).length === 0) {
      for (const b of starterBlog) {
        await ctx.db.insert("blogPosts", {
          ...b,
          createdAt: stamp,
          updatedAt: stamp,
        });
        blog += 1;
      }
    }
    return { inserted: { projects, academic, blog } };
  },
});

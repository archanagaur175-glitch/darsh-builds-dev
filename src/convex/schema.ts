import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

export const academicKindValidator = v.union(
  v.literal("coursework"),
  v.literal("research"),
);

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Content for the Darsh Builds portfolio. All rows are created and edited
    // through the /admin headless CMS (owner-only, Convex Auth gated).
    projects: defineTable({
      slug: v.string(), // url slug, unique
      title: v.string(), // display title
      summary: v.string(), // 1-2 sentence factual summary
      architecture: v.string(), // markdown writeup of real code structure
      stack: v.array(v.string()), // tech stack tags
      repoOwner: v.string(), // github owner login
      repoName: v.string(), // github repo name
      demoUrl: v.optional(v.string()), // live demo link if one exists
      docsUrl: v.optional(v.string()), // docs / readme link if one exists
      featured: v.boolean(), // flagship projects shown on the landing page
      scaffold: v.boolean(), // true when the repo has no committed source yet
      published: v.boolean(), // visible on public pages
      order: v.number(), // ascending sort for showcase order
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_order", ["order"])
      .index("by_slug", ["slug"]),

    academicEntries: defineTable({
      slug: v.string(), // url/display slug
      kind: academicKindValidator, // coursework | research
      title: v.string(), // course name or research title
      institution: v.string(), // school / lab / context
      context: v.optional(v.string()), // e.g. grade level or programme
      year: v.string(), // academic year or term label
      concepts: v.array(v.string()), // key concepts covered
      abstract: v.optional(v.string()), // research abstract (markdown)
      artifacts: v.array(
        v.object({
          label: v.string(),
          url: v.string(),
        }),
      ), // links to papers, notebooks, repos
      published: v.boolean(),
      order: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("by_order", ["order"]),

    blogPosts: defineTable({
      slug: v.string(), // url slug, unique
      title: v.string(),
      date: v.number(), // epoch ms of publish date
      summary: v.string(),
      body: v.string(), // markdown
      published: v.boolean(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("by_slug", ["slug"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;

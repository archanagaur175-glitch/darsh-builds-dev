import type { MutationCtx, QueryCtx } from "./_generated/server";
import { getCurrentUser } from "./users";

/**
 * True when the signed-in user has the admin role. Public queries never call
 * this; only write/management paths do, and they throw when it is false.
 */
export const isAdmin = async (ctx: QueryCtx | MutationCtx) => {
  const user = await getCurrentUser(ctx);
  return user?.role === "admin";
};

/** Email of the signed-in user, if any. */
export const currentEmail = async (ctx: QueryCtx | MutationCtx) => {
  const user = await getCurrentUser(ctx);
  return user?.email ?? null;
};

export const now = () => Date.now();

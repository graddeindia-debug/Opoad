import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// For demo: use a test userId since we don't have proper session handling yet
const TEST_USER_ID = "test-user-demo";

export default defineEventHandler(async (event) => {
  try {
    if (event.method === "GET") {
      // Get all projects
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, TEST_USER_ID))
        .orderBy(projects.createdAt);
      return result;
    } else if (event.method === "POST") {
      // Create new project
      const body = await readBody(event);
      const result = await db
        .insert(projects)
        .values({
          userId: TEST_USER_ID,
          name: body.name,
          description: body.description,
          icon: body.icon || "📁",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return result[0];
    }
  } catch (error) {
    console.error("[v0] API error:", error);
    return { error: "Failed to process request" };
  }
});

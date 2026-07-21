import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const TEST_USER_ID = "test-user-demo";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) return { error: "ID required" };

    const projectId = parseInt(id);

    if (event.method === "GET") {
      // Get single project
      const result = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, projectId), eq(projects.userId, TEST_USER_ID)));
      return result[0];
    } else if (event.method === "PUT") {
      // Update project
      const body = await readBody(event);
      const result = await db
        .update(projects)
        .set({
          name: body.name,
          description: body.description,
          icon: body.icon,
          updatedAt: new Date(),
        })
        .where(and(eq(projects.id, projectId), eq(projects.userId, TEST_USER_ID)))
        .returning();
      return result[0];
    } else if (event.method === "DELETE") {
      // Delete project
      await db
        .delete(projects)
        .where(and(eq(projects.id, projectId), eq(projects.userId, TEST_USER_ID)));
      return { success: true };
    }
  } catch (error) {
    console.error("[v0] API error:", error);
    return { error: "Failed to process request" };
  }
});

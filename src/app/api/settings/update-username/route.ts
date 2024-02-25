import { db } from "@/lib/db";
import { getUserSession } from "@/lib/nextauth-options";
import { updateUsernamesValidator } from "@/lib/validators";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const session = await getUserSession();

    if (!session?.user) return new Response("Anauthorized", { status: 401 });

    const body = await req.json();

    const { username } = updateUsernamesValidator.parse(body);

    const existingUsername = await db.user.findFirst({
      where: {
        username,
      },
    });

    if (existingUsername)
      return new Response("Username already taken", { status: 409 });

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
      },
    });

    return new Response("Username updated", { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return new Response("Invalid user data passed", { status: 400 });
    return new Response("Something went wrong, try again", { status: 500 });
  }
};

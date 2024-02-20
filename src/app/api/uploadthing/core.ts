import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // @ts-expect-error
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    // @ts-expect-error
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

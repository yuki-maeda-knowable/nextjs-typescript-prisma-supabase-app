import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const userId = "clfkq7w5f00003my3ya43dmb7";
const postId = "clfrwvtsb0000mh08aybpylcw";

async function main() {
  const comments = await prisma.comments.create({
    data: {
      content: "comments comments comments comments ",
      userId: userId,
      postId: postId,
    },
  });
  console.log({ comments });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

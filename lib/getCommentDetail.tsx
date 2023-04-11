import prisma from "./prisma";

const getCommentDetail = async (id: string) => {
  const comment = await prisma.comments.findMany({
    where: {
      id: id,
    },
  });
  return JSON.parse(JSON.stringify(comment));
};

export default getCommentDetail;

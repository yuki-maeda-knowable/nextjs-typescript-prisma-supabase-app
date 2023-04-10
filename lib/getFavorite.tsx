import prisma from "./prisma";

const getFavorite = async () => {
  const favorite = await prisma.favorites.findMany({});
  return favorite;
};

export default getFavorite;

import prisma from "./prisma";

export default async function getProfile(id) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: id,
    },
    include: {
      Photo: true,
    },
  });
  const newProfile = { ...profile, birthday: String(profile.birthday) };
  return newProfile;
}

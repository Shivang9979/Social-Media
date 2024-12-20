// ProfileCard.tsx (Server Component)
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/client';
import ProfileCardClient from './ProfileCardClient';

export default async function ProfileCard() {
  const { userId } = auth();
  if (!userId) return null;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      follower: {
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
       
        select: {
          following: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
        },
      },
      _count: {
        select: {
          follower: true,
        },
      },
    },
  });

  return <ProfileCardClient user={user} />;
}

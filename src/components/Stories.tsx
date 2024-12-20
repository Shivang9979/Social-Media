import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import StoryList from "./StoryList";


const Stories = async () => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) return null;

  const stories = await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: new Date(), // Only fetch stories that have not expired
      },
      OR: [
        {
          userId: currentUserId, // Fetch the current user's own stories
        },
        {
          user: {
            follower: {
              some: {
                followingId: currentUserId, // Fetch stories of users the current user is following
              },
            },
          },
        },
      ],
    },
    include: {
      user: true, // Include the user who posted the story
    },
  });
 

// console.log(stories)

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
      <div className="flex gap-8 w-max">
        <StoryList stories={stories} userId={currentUserId}/>
      </div>
    </div>
  );
};

export default Stories;
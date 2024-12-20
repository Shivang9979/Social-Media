import { NextResponse } from 'next/server';
import prisma from '@/lib/client';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    return NextResponse.json(stories,{status:200});
}

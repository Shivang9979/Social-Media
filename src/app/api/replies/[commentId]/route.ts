import { NextResponse } from 'next/server';
import prisma from '@/lib/client';

// Handle GET requests
export async function GET(req: Request, { params }: { params: { commentId: string } }) {
    const { commentId } = params;

    if (!commentId) {
        return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    try {
        const replies = await prisma.reply.findMany({
            where: {
                commentId: Number(commentId),
            },
            include: {
                user: true,
            },
        });

        return NextResponse.json(replies, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
    }
}

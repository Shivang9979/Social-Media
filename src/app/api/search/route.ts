import { NextResponse } from 'next/server';
import prisma from '@/lib/client'; // Adjust the path to your Prisma instance

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ message: 'Username is required' }, { status: 400 });
  }

  try {
    // Fetch users without case-insensitivity
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username, // Basic contains filter
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
      take: 5, // Limit the number of suggestions
    });

    // Manual case-insensitive filtering
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(username.toLowerCase())
    );

    return NextResponse.json(filteredUsers);
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

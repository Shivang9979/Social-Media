
import Post from '@/components/feed/Post';
import prisma from '@/lib/client';
import { auth } from '@clerk/nextjs/server';
import React from 'react'

export default async function  page() {
    const { userId } = auth();

  let posts:any[] =[];

    if(!userId) throw new Error("User is not Authenticated")
    posts = await prisma.post.findMany({
      where: {
       userId:userId
      },
      include: {
        user: true,
        like: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
  return (
    <div className='bg-slate-100 py-12 '>
    <div className="p-4  bg-white shadow-md rounded-lg  flex flex-col gap-4 h-screen overflow-auto scrollbar-hide   ">
    {posts.length ? (posts.map(post=>(
      <Post key={post.id} post={post}/>
    ))) : "No posts found!"}
  </div>
  </div>
  )

}

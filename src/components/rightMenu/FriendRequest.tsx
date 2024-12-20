import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/client'
import FriendRequestList from './FriendRequestList'
export default async function FriendRequest() {
  const {userId}=auth()
  if (!userId) return null;
  const req=await prisma.followRequest.findMany({
    where:{
      receiverId:userId
    },
    include:{
      sender:true
    }
  })
  if (req.length===0) return null;
  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm  flex flex-col gap-4 '>
      <div className='flex justify-between items-center font-medium '>
        <span className=' text-gray-500'>Friend Request</span>
        <Link href=""className="text-pink-500 text-xs">See all</Link>
      </div>
      <FriendRequestList request={req}/>
    </div>
  )
}

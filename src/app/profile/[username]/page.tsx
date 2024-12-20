

import Feed from '@/components/feed/Feed'
import LeftMenu from '@/components/leftMenu/LeftMenu'
import RightMenu from '@/components/rightMenu/RightMenu'
import prisma from '@/lib/client'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function ProfilePage({params}:{params:{username:string}}) {
  const username=params.username
  const user =await prisma.user.findFirst({
    where:{
      username,
    },
    include:{
      _count:{
        select:{
          follower:true,
          following:true,
          post:true
        }
      }
    }
  })
  if(!user) return notFound();
  const {userId:currentUserId}=auth()
  let isBlocked ;
  if(currentUserId){
    const blocked=await prisma.block.findFirst({
      where:{
        blockerId:user.id,
        blockedId:currentUserId
      }
    })
    if(blocked) isBlocked=true;
  }else{
    isBlocked=false
  }
  if(isBlocked) return notFound()
  return (
    <div><div className='flex gap-6 pt-6 '>
    <div className="hidden xl:block w-[20%]"><LeftMenu type='profile'/></div>
    <div className=" w-full lg:w-[70%] xl:w-[50%]">
      <div className="flex flex-col gap-6">
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full h-64 relative'>
            <Image src={user.cover || "/noCover.png"} alt="" fill className="object-cover rounded-md"/>
            <Image src={user.avatar || "noAvatar.png"} alt="" height={128} width={128} className="w-32 h-32 rounded-full absolute object-cover left-0 right-0 m-auto -bottom-16 ring-4 ring-white"/>
          </div>
          <h1 className='mt-20 mb-4 text-2xl font-medium'>{(user.name && user.surname)?user.name +""+user.surname:user.username}</h1>
          <div className='flex items-center justify-center gap-12 mb-4'>
            <div className='flex flex-col items-center'>
              <span className='font-medium'>{user._count.post}</span>
              <span className='text-sm'>Post</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='font-medium'>{user._count.follower}</span>
              <span className='text-sm'>Followers</span>
            </div>
            <div className='flex flex-col items-center'>
              <span className='font-medium'>{user._count.following}</span>
              <span className='text-sm'>Following </span>
            </div>
          </div>
        </div>
        <Feed/>
      </div>
    </div>
    <div className="hidden lg:block w-[30%]"><RightMenu user={user}/></div>
    </div>
    </div>
  )
}

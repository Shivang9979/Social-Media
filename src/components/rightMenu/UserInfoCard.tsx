import Link from 'next/link'
import Image from 'next/image'

import { User } from '@prisma/client'
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/client'
import UpdateUser from './UpdateUser';

import UserCardInteraction from './UserCardInteraction';

export default async function UserInfoCard({ user }: { user: User }) {

  const createdAtDate = new Date(user.createdAt);
  const formatedDate = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  let isUserBlocked = false
  let isFollowing = false
  let isFollowingSent = false
  const { userId: currentUserId } = auth()

  // console.log(currentUserId)
  if(!currentUserId){
    throw new Error("User not authenticated")
  }
  if (currentUserId) {
    const blockRes = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id
      }

    })
    blockRes ? (isUserBlocked = true) : (isUserBlocked = false)
    const followRes = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.id
      }

    })
    followRes ? (isFollowing = true) : (isFollowing = false)
    const followReqRes = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.id
      }

    })
    followReqRes ? (isFollowingSent = true) : (isFollowingSent = false)


  }

  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm  flex flex-col gap-4 '>
      <div className='flex justify-between items-center font-medium '>
        <span className=' text-gray-500'>User Information</span>
      {currentUserId===user.id? <UpdateUser user={user} />:(<Link href="" className="text-pink-500 text-xs">See all</Link>)}
      </div>
      <div className='flex flex-col gap-4 text-gray-500 '>
        <div className='flex items-center gap-2'>
          <span className='text-xl text-black'>{(user.name && user.surname) ? user.name + " " + user.surname : user.username}</span>
          <span className='text-sm'>@{user.username}</span>
        </div>
        {user.description && <p>
          {user.description}
        </p>}
        {user.city && <div className='flex items-center gap-2'>
          <Image src="/map.png" alt="" height={16} width={16} />
          <span>Living in <b>{user.city}</b></span>
        </div>}
        {user.school && <div className='flex items-center gap-2'>
          <Image src="/school.png" alt="" height={16} width={16} />
          <span>Went to <b>{user.school}</b></span>
        </div>}
        {user.work && <div className='flex items-center gap-2'>
          <Image src="/work.png" alt="" height={16} width={16} />
          <span>Work at <b>{user.work}</b></span>
        </div>}
        <div className='flex items-center justify-between '>
          {user.website && <div className='flex gap-1 items-center'>
            <Image src="/link.png" alt="" height={16} width={16} />
            <Link href={`${user.website}`} className='text-pink-500 font-medium'>{user.website}</Link>
          </div>}
          <div className='flex gap-1 items-center '>
            <Image src="/date.png" alt="" height={16} width={16} />
            <span>{formatedDate}</span>
          </div>
        </div>
        {currentUserId && user.id!==currentUserId &&( 
         <UserCardInteraction userId={user.id} isUserBlocked={isUserBlocked} isFollowing={isFollowing} isFollowingSent= 
           {isFollowingSent} /> 
        )
        }

      </div>
    </div>
  )
}

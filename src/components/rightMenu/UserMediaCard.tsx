import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { User } from '@prisma/client'
import prisma from '@/lib/client'

export default async function UserMediaCard({user}:{user:User}) {
  const postMedia=await prisma.post.findMany({
    where:{
      userId:user.id,
      img:{
        not:null
      },
      
      
    },
    take:8,
    orderBy:{
      createdAt:"desc",
  }})
  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm  flex flex-col gap-4 '>
    <div className='flex justify-between items-center font-medium '>
      <span className=' text-gray-500'>User Media</span>
      <Link href=""className="text-pink-500 text-xs">See all</Link>
    </div>
    <div className='flex gap-4 justify-between flex-wrap'>
       {postMedia.length ?(postMedia.map((post)=>(
        <div className='relative w-1/5 h-24' key={post.id}>
            <Image src={post.img!} alt="" fill className="object-cover rounded-md"/>
        </div>)))
        :"No Media Found"}
    </div>
    </div>
  )
}

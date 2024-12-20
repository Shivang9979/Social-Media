"use client"
import React, { useOptimistic, useState } from 'react'
import Image from 'next/image'
import { FollowRequest, User } from '@prisma/client'
import { acceptFollowRequest } from '@/lib/actions'
import { declineFollowRequest } from '@/lib/actions'
type RequestWithUser = FollowRequest & {
    sender: User
}
export default function FriendRequestList({ request }: { request: RequestWithUser[] }) {
    const [requestState,setRequestState]=useState(request)
    const [optimisticRequest,removeOptmisticRequest]=useOptimistic(
        requestState,
        (state,value:number)=>state.filter((req)=>req.id!==value)
    )
    const accept=async(requestId:number,userId:string)=>{
        removeOptmisticRequest(requestId)
        try {
            await acceptFollowRequest(userId)
            setRequestState((prev)=>prev.filter((req)=>req.id!==requestId))
        } catch (error) {
            
        }
    }
    const decline=async(requestId:number,userId:string)=>{
        removeOptmisticRequest(requestId)
        try {
            await declineFollowRequest(userId)
            setRequestState((prev)=>prev.filter((req)=>req.id!==requestId))
        } catch (error) {
            
        }
    }
    return (
        <div className=''>
            {request.map((request) => (


                <div className='flex items-center justify-between ' key={request.id}>
                    <div className='flex items-center gap-4'>
                        <Image src= {request.sender.avatar || "noAvatar.png"}alt="" height={40} width={40} className="w-10 h-10 rounded-full object-cover " />
                        <span className='font-semibold'>{(request.sender?.name && request.sender?.surname)? (request.sender.name+" "+request.sender.surname ): request.sender?.username}</span>
                    </div>
                    <div className='flex gap-3 justify-end'>
                        <form action={()=>accept(request.id,request.sender.id)}>
                            <button>
                        <Image src={'/accept.png'} alt='' width={20} height={20} className='cursor-pointer' />
                        </button>                 
                        </form>
                        <form action={()=>decline(request.id,request.sender.id)}>
                            <button>
                        <Image src={'/reject.png'} alt='' width={20} height={20} className='cursor-pointer' />
                        </button>                 
                        </form>                   
                    </div>

                </div>
            ))}
        </div>
    )
}

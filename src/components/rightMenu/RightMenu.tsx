
import React, { Suspense } from 'react'
import FriendRequest from './FriendRequest'
import Birthday from './Birthday'
import Ad from '../Ad'

import UserMediaCard from './UserMediaCard'
import { User } from '@prisma/client'
import UserInfoCard from './UserInfoCard'
export default function RightMenu({user}:{user?:User}) {
  console.log(user)
  return (
    <div className='flex flex-col gap-6 '>
      {user ?(<>
      <Suspense fallback="Loading..">
      <UserInfoCard user={user}/>
      </Suspense>
      <Suspense fallback="Loading..">
      <UserMediaCard user={user}/>
      </Suspense>
      </>):null}
      <FriendRequest/>
      <Birthday/>
      <Ad size="md"/>
    </div>
  )
}

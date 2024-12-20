// ProfileCardClient.tsx (Client Component)
'use client';

import Image from 'next/image';
import Link from 'next/link';
interface Follower {
    id: string;
    avatar: string | null;
    username: string | null;
  }
  
  interface User {
    id: string;
    username: string;
    avatar: string | null;
    name: string | null;
    surname: string | null;
    cover: string | null;
    follower: {
      following: Follower;
    }[];
    _count: {
      follower: number;
    };
  }
  interface ProfileCardClientProps {
    user: User | null;
  }
export default function ProfileCardClient({ user}:ProfileCardClientProps) {
  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6'>
      <div className='h-20 relative'>
        <Image src={user?.cover || "/noCover.png"} alt="" fill className="rounded-md object-cover" />
        <Image
          src={user?.avatar || "/noAvatar.png"}
          alt=""
          width={48}
          height={48}
          className="rounded-full w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10 object-cover"
        />
      </div>
      <div className='h-20 flex flex-col gap-2 items-center'>
        <span className='font-semibold'>{(user?.name && user?.surname) ? (user.name + " " + user.surname) : user?.username}</span>
        <div className='flex items-center gap-4'>
          <div className='flex items-center justify-center'>
            {user?.follower.map((follow) => (
              <Image
                key={follow.following.id}
                src={follow.following.avatar || "/noAvatar.png"}
                height={12}
                width={12}
                className='rounded-full object-cover w-3 h-3'
                alt=""
              />
            
            ))}
          </div>
          <span className='text-xs text-gray-500'>{user?._count.follower}{user?._count.follower==1?`  follower`:"followers"} </span>
        </div>
        <Link href={`/profile/${user?.username}`}>
          <button className='bg-pink-500 text-white text-xs p-2 rounded-md'>My Profile</button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchFollower, sharePost } from '@/lib/actions';

export default function SharePost({ postId }: { postId: number }) {
  const [open, setOpen] = useState(true);
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);

  interface Follower {
    follower: {
      id: string;
      username: string;
      avatar: string | null;
      name: string | null;
      surname: string | null;
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchFollower();
      if (result) {
        setFollowers(result);
      }
    };

    fetchData();
  }, []);

  const handleShare = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await sharePost(postId,selectedFollowers);
     
      setOpen(false);
    } catch (error) {
      alert('Failed to share post');
    }
  };

  const handleSelectFollower = (followerId: string) => {
    setSelectedFollowers(prev =>
      prev.includes(followerId)
        ? prev.filter(id => id !== followerId)
        : [...prev, followerId]
    );
  };

  return (
    <>
      {open && (
        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-65 z-50'>
          <div className='bg-white h-[90vh] w-1/3 relative my-6 rounded-lg p-8 overflow-auto flex flex-col gap-2'>
            <div className='absolute top-2 right-4'>
              <span
                className='cursor-pointer text-xl'
                onClick={() => setOpen(false)}
              >
                X
              </span>
            </div>
            <form onSubmit={handleShare}>
              {followers.length > 0 ? (
                followers.map(follow => (
                  <div key={follow.follower.id} className='flex items-center border-2 rounded-lg p-2 gap-4'>
                    <Image
                      src={follow.follower.avatar || "/noAvatar.png"}
                      width={40}
                      height={40}
                      alt={follow.follower.username}
                      className="w-14 h-14 rounded-full"
                    />
                    <p className='text-pink-500'>
                      {follow.follower.name ? `${follow.follower.name} ${follow.follower.surname}` : `@${follow.follower.username}`}
                    </p>
                    <input
                      type="checkbox"
                      checked={selectedFollowers.includes(follow.follower.id)}
                      onChange={() => handleSelectFollower(follow.follower.id)}
                      className='ml-auto'
                    />
                  </div>
                ))
              ) : (
                <div>No followers</div>
              )}
              <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
                Share Post
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

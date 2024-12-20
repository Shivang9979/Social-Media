"use client";

import { addReply, getLike, toggleReplyLike, checkIfUserLikedReply } from '@/lib/actions';
import React, { useOptimistic, useState, useEffect } from 'react';
import { User, Reply as ReplyType } from '@prisma/client';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import ReplyInfo from './ReplyInfo';

type ReplyWithUser = ReplyType & { user: User };

type LikeData = Record<number, { count: number; hasLiked: boolean }>;

export default function ReplyList({ replies, commentId }: { replies: ReplyWithUser[], commentId: number }) {
  const { user } = useUser();
  const [desc, setDesc] = useState("");
  const [replyState, setReplyState] = useState(replies);
  const [optimisticReply, addOptimisticReply] = useOptimistic(
    replyState,
    (state, value: ReplyWithUser) => [value, ...state]
  );
  const [likeData, setLikeData] = useState<LikeData>(
    replies.reduce((acc, curr) => {
      acc[curr.id] = { count: 0, hasLiked: false };
      return acc;
    }, {} as LikeData)
  );

  useEffect(() => {
    const fetchLikesData = async () => {
      if (user) {
        const updatedLikeData = await Promise.all(
          replies.map(async (r) => {
            const count = await getLike(r.id); // Assuming `getLike` handles replies too
            const hasLiked = await checkIfUserLikedReply(r.id); // Function to check if user liked this reply
            return {
              id: r.id,
              count,
              hasLiked,
            };
          })
        );
        const likeDataMap = updatedLikeData.reduce((acc, { id, count, hasLiked }) => {
          acc[id] = { count, hasLiked };
          return acc;
        }, {} as LikeData);
        setLikeData(likeDataMap);
      }
    };

    fetchLikesData();
  }, [user, replies]);

  const add = async () => {
    if (!user || !desc) return;

    const temporaryReply: ReplyWithUser = {
      id: Math.random(),
      desc,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,

      user: {
        id: user.id,
        username: "Sending Please Wait...",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      commentId: commentId,
    };

    addOptimisticReply(temporaryReply);
    try {
      const createdReply = await addReply(commentId, desc);
      setReplyState((prev) => [
        createdReply,
        ...prev.filter((c) => c.id !== temporaryReply.id),
      ]);
    } catch (error) {
      setReplyState((prev) => prev.filter((c) => c.id !== temporaryReply.id));
      console.log(error);
    }
  };

  const handleLike = async (replyId: number) => {
    setLikeData((prev) => {
      const existingData = prev[replyId] || { count: 0, hasLiked: false };
      const { count, hasLiked } = existingData;

      return {
        ...prev,
        [replyId]: {
          count: hasLiked ? count - 1 : count + 1,
          hasLiked: !hasLiked,
        },
      };
    });

    try {
      await toggleReplyLike(replyId);
    } catch (error) {
      console.error("Failed to toggle like", error);

      // Revert the optimistic update if the server request fails
      setLikeData((prev) => {
        const existingData = prev[replyId] || { count: 0, hasLiked: false };
        const { count, hasLiked } = existingData;

        return {
          ...prev,
          [replyId]: {
            count: hasLiked ? count + 1 : count - 1,
            hasLiked: !hasLiked,
          },
        };
      });
    }
  };

  const handleDelete = (deletedReplyId: number) => {
    setReplyState((prev) => prev.filter((reply) => reply.id !== deletedReplyId));
  };

  return (
    <>
      <div className='py-2 px-8'>
        <form action={add} className='flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full'>
          <input
            type="text"
            placeholder="Write a Reply..."
            className="bg-transparent outline-none flex-1"
            onChange={(e) => setDesc(e.target.value)}
          />
        </form>
      </div>
      <div className="flex flex-1 flex-col mt-4 max-h-[220px] overflow-auto scrollbar-hide">
        {replies.length === 0 ? (
          <div className='flex w-full text-gray-500 p-1 border-t-2 items-center justify-center'>
            <span>No replies yet.</span>
          </div>
        ) : (
          optimisticReply.map((reply) => (
            <div key={reply.id} className="border-t-2 border-gray-300 bg-gray-100">
              <div className='flex justify-between p-2 gap-2'>
                <Image
                  src={reply.user.avatar || "noAvatar.png"}
                  alt=""
                  width={10}
                  height={10}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex flex-col  flex-1">
                  <span className="font-sm text-blue-500">
                    {reply.user.name && reply.user.surname
                      ? reply.user.name + " " + reply.user.surname
                      : "@" + reply.user.username}
                  </span>
                  <p className="text-pink-500 font-sm">{reply.desc}</p>
                  <div className="flex items-center gap-8 text-xs text-gray-500 ">
                    <div className="flex items-center gap-4">
                      <Image
                        src={likeData[reply.id]?.hasLiked ? "/liked.png" : "/like.png"}
                        alt=""
                        width={10}
                        height={10}
                        className="cursor-pointer w-3 h-3"
                        onClick={() => handleLike(reply.id)}
                      />
                      <span className="text-gray-300 font-sm">|</span>
                      <span className="text-gray-500 font-sm">{likeData[reply.id]?.count}</span>
                    </div>
                  </div>
                </div>
                {reply.user.id == user?.id && <ReplyInfo replyId={reply.id} onDelete={handleDelete} />}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

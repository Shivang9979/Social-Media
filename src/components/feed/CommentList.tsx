"use client";

import { addComment, getLike, toggleCommentLike, checkIfUserLiked } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Comment, User, Reply as ReplyType } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState, useEffect } from "react";
import CommentInfo from "./CommentInfo";
import Reply from "./Reply";



type CommentWithUser = Comment & { user: User } & {
  _count: { reply: number };
};

type LikeData = Record<number, { count: number; hasLiked: boolean }>;

const CommentList = ({
  comment,
  postId,
}: {
  comment: CommentWithUser[];
  postId: number;
}) => {
  const { user } = useUser();
  const [commentState, setCommentState] = useState(comment);
  const [desc, setDesc] = useState("");
  const [open, setOpen] = useState(false)
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    commentState,
    (state, value: CommentWithUser) => [value, ...state]
  );
  const [showReply, setReply] = useState(false)

  const [likeData, setLikeData] = useState<LikeData>(
    comment.reduce((acc, curr) => {
      acc[curr.id] = { count: 0, hasLiked: false };
      return acc;
    }, {} as LikeData)
  );

  useEffect(() => {
    const fetchLikesData = async () => {
      if (user) {
        const updatedLikeData = await Promise.all(
          comment.map(async (c) => {
            const count = await getLike(c.id);
            const hasLiked = await checkIfUserLiked(c.id);
            return {
              id: c.id,
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
  }, [user, comment]);

  const add = async () => {
    if (!user || !desc) return;

    const temporaryComment: CommentWithUser = {
      id: Math.random(), // This should be a real ID from your backend
      desc,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      postId: postId,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      videoId: null,
      _count: { reply: 0 }, // Ensure this matches the CommentWithUser type
    };

    addOptimisticComment(temporaryComment);

    try {
      const createdComment = await addComment(postId, desc);
      setCommentState((prev) => [
        {
          ...createdComment, // Ensure this matches CommentWithUser
          _count: { reply: 0 }, // Ensure this matches CommentWithUser
        },
        ...prev.filter((c) => c.id !== temporaryComment.id),
      ]);
    } catch (err) {
      setCommentState((prev) => prev.filter((c) => c.id !== temporaryComment.id));
      console.error("Failed to add comment", err);
    }
  };

  const handleLike = async (commentId: number) => {
    setLikeData((prev) => {
      const existingData = prev[commentId] || { count: 0, hasLiked: false };
      const { count, hasLiked } = existingData;

      return {
        ...prev,
        [commentId]: {
          count: hasLiked ? count - 1 : count + 1,
          hasLiked: !hasLiked,
        },
      };
    });

    try {
      await toggleCommentLike(commentId);
    } catch (error) {
      console.log("Failed to toggle like", error);

      // Revert the optimistic update if the server request fails
      setLikeData((prev) => {
        const existingData = prev[commentId] || { count: 0, hasLiked: false };
        const { count, hasLiked } = existingData;

        return {
          ...prev,
          [commentId]: {
            count: hasLiked ? count + 1 : count - 1,
            hasLiked: !hasLiked,
          },
        };
      });
    }
  };

  const handleDelete = (deletedCommentId: number) => {
    setCommentState((prev) => prev.filter((comment) => comment.id !== deletedCommentId));
  };


  return (
    <>
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.imageUrl || "noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            action={add}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
              onChange={(e) => setDesc(e.target.value)}
            />
            <Image
              src="/comment.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
              onClick={() => setOpen((prev) => !prev)}
            />
          </form>
        </div>
      )}
      {open &&
        <div className=" mt-6 border-2 rounded-lg">
          {optimisticComments.map((comment) => (<div className="flex flex-col">
            <div className="flex gap-4 justify-between  p-2" key={comment.id}>
              <Image
                src={comment.user.avatar || "noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col gap-2 flex-1">
                <span className="font-medium text-gray-700">
                  {comment.user.name && comment.user.surname
                    ? comment.user.name + " " + comment.user.surname
                    : "@" + comment.user.username}
                </span>
                <p className="text-gray-500">{comment.desc}</p>
                <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-4">
                    <Image
                      src={likeData[comment.id]?.hasLiked ? "/liked.png" : "/like.png"}
                      alt=""
                      width={12}
                      height={12}
                      className="cursor-pointer w-4 h-4"
                      onClick={() => handleLike(comment.id)}
                    />
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">{likeData[comment.id]?.count}</span>
                  </div>

                  <div className="cursor-pointer" onClick={() => setReply((prev) => !prev)}>{showReply ? "Hide Reply" : "Reply"} {`(${comment._count.reply})`}</div>
                </div>
              </div>
              {comment.user.id == user?.id && <CommentInfo commentId={comment.id} onDelete={handleDelete} />}
            </div>

            {showReply && <Reply commentId={comment.id}   ></Reply>}
          </div>

          ))}

        </div>}
    </>
  );
};

export default CommentList;

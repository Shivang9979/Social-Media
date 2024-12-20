
import Image from "next/image";
import Comment from "./Comment";
import { Post as PostType, User } from "@prisma/client";
import PostInteraction from "./PostInteraction";
import { Suspense } from "react";
import PostInfo from "./PostInfo";
import { auth } from "@clerk/nextjs/server";

import VideoPlayer from "./Videoplayer";
// import Videoplayer from "./Videoplayer";

type FeedPostType = PostType & { user: User } & {
  like: [{ userId: string }];
} & {
  _count: { comment: number };
}&{
  currentUserId:string
};

const Post = ({ post }: { post: FeedPostType }) => {
  const createdAt = post.createdAt;
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(createdAt);

  const { userId } = auth();
  return (
    <div className="flex flex-col gap-4 border-2 p-4 rounded-lg">
      {/* USER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avatar || "/noAvatar.png"}
            width={40}
            height={40}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium flex flex-col  items-center ">
            <div className="text-pink-500">
            {post.user.name && post.user.surname
              ? "Created By:"+post.user.name + " " + post.user.surname
              : "@"+post.user.username}
              </div>
              <div className="text-[10px] text-gray-500">
                {formattedDate}
              </div>
          </span>
        </div>
        {userId === post.user.id && <PostInfo postId={post.id} />}
      </div>
      {/* DESC */}
      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="w-full min-h-96 relative">
            <Image
              src={post.img}
              fill
              className="object-cover rounded-md"
              alt=""
            />
          </div>
        )}
        {
          post.video && (
            <div className="w-full  relative   rounded-lg" >
                <VideoPlayer video={post.video}/>
            </div>
            
          )
        }
        <div className="min-h-20 text-gray-700 border-2 rounded-lg p-2">
        <p>{post.desc}</p>
        </div>
      </div>
      {/* INTERACTION */}
      <Suspense fallback="Loading...">
        <PostInteraction
          postId={post.id}
          like={post.like.map((like) => like.userId)}
          commentNumber={post._count.comment}
          
        />
      </Suspense>
      <Suspense fallback="Loading...">
        <Comment postId={post.id} />
      </Suspense>
    </div>
  );
};

export default Post;
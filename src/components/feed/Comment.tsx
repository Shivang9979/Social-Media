
import prisma from "@/lib/client";

import CommentList from "./CommentList";
import { Suspense } from "react";


const Comment = async ({postId}:{postId:number}) => {

    const comment = await prisma.comment.findMany({
        where:{
            postId,
        },
        include:{
            user:true,
            _count:{
              select: {
                reply: true,
              },
            } 
           
 
        
        }
    })
//   console.log(comment)
    
  return (
    <div className="">
      
      <CommentList comment={comment} postId={postId} />
      
    </div>
  );
};

export default Comment;

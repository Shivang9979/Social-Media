"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "./client"
import { z } from "zod";
import { revalidatePath } from "next/cache";


export const switchFollow = async (userId: string) => {
    const { userId: currentUserId } = auth()
    if (!currentUserId) {
        return new Error("User not authenticated")
    }
    try {
        const existingFollow = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: userId
            }
        })

        if (existingFollow) {
            await prisma.follower.delete({
                where: {
                    id: existingFollow.id
                }
            })
        } else {
            const existingFollowRequest = await prisma.followRequest.findFirst({
                where: {
                    senderId: currentUserId,
                    receiverId: userId
                }
            })

            if (existingFollowRequest) {
                await prisma.followRequest.delete({
                    where: {
                        id: existingFollowRequest.id
                    }
                })
            } else {
                await prisma.followRequest.create({
                    data: {
                        senderId: currentUserId,
                        receiverId: userId
                    }
                })
            }
        }
        revalidatePath("/")
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong")
    }
}
export const switchBlock = async (userId: string) => {
    const { userId: currentUserId } = auth()
    if (!currentUserId) {
        throw new Error("User is not Authenticated")
    }

    try {
        const exisitingBlock = await prisma.block.findFirst({
            where: {
                blockerId: currentUserId,
                blockedId: userId,
            }

        })
        if (exisitingBlock) {

            await prisma.block.delete({
                where: {
                    id: exisitingBlock.id
                }
            })
        }
        else {
            await prisma.block.create({
                data: {
                    blockerId: currentUserId,
                    blockedId: userId
                }
            })
        }

    } catch (error) {
        console.log(error)
        throw new Error("Something Went Wrong")
    }
}
export const acceptFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = auth()
    if (!currentUserId) {
        return new Error("User not authenticated")
    }
    try {
        const exisitingFollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            }

        })
        if (exisitingFollowRequest) {
            await prisma.followRequest.delete({
                where: {
                    id: exisitingFollowRequest.id
                }
            })

        }
        await prisma.follower.create({
            data: {
                followerId: userId,
                followingId: currentUserId,
            },
        });

        revalidatePath("/")
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong")
    }

}
export const declineFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        throw new Error("User is not Authenticated!!");
    }

    try {
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            },
        });

        if (existingFollowRequest) {
            await prisma.followRequest.delete({
                where: {
                    id: existingFollowRequest.id,
                },
            });
        }
        revalidatePath("/")
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};
export const updateProfile = async (
    prevState: { success: boolean; error: boolean },
    payload: { formData: FormData; cover: string }
) => {
    const { formData, cover } = payload;
    const fields = Object.fromEntries(formData);

    const filteredFields = Object.fromEntries(
        Object.entries(fields).filter(([_, value]) => value !== "")
    );

    const Profile = z.object({
        cover: z.string().optional(),
        name: z.string().max(60).optional(),
        surname: z.string().max(60).optional(),
        description: z.string().max(255).optional(),
        city: z.string().max(60).optional(),
        school: z.string().max(60).optional(),
        work: z.string().max(60).optional(),
        website: z.string().max(60).optional(),
    });

    const validatedFields = Profile.safeParse({ cover, ...filteredFields });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return { success: false, error: true };
    }

    const { userId } = auth();

    if (!userId) {
        return { success: false, error: true };
    }

    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: validatedFields.data,
        });
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const addReply=async(commentId:number,desc:string)=>{
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");
   try {
     const createdReply=await prisma.reply.create({
         data:{
             commentId:commentId,
             userId:userId,
             desc:desc
         },
         include:{
            user:true
         }
     })
     revalidatePath("/api/replies")
return createdReply
   } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
   }

}
export const addComment = async (postId: number, desc: string) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        const createdComment = await prisma.comment.create({
            data: {
                desc,
                userId,
                postId,
            },
            include: {
                user: true,
            },
        });

        revalidatePath("/")
        return createdComment;
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const addPost = async (formData: FormData, img: string, video: string) => {
    const desc = formData.get("desc") as string;

    const Desc = z.string().min(1).max(255);

    const validatedDesc = Desc.safeParse(desc);

    if (!validatedDesc.success) {
        //TODO
        console.log("description is not valid");
        return;
    }
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");
    if (img && img !== "") {
        try {
            await prisma.post.create({
                data: {
                    desc: validatedDesc.data,
                    userId,
                    img,
                },
            });

            revalidatePath("/");
        } catch (err) {
            console.log(err);
        }
    }
    if (video && video !== "") {
        try {
            await prisma.post.create({
                data: {
                    desc: validatedDesc.data,
                    userId,
                    video,
                },
            });

            revalidatePath("/");
        } catch (err) {
            console.log(err);
        }
    }
    else {
        try {
            await prisma.post.create({
                data: {
                    desc: validatedDesc.data,
                    userId,

                },
            });

            revalidatePath("/");
        } catch (err) {
            console.log(err);
        }
    }

};

export const addStory = async (img: string) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        const existingStory = await prisma.story.findFirst({
            where: {
                userId,
            },
        });

        if (existingStory) {
            await prisma.story.delete({
                where: {
                    id: existingStory.id,
                },
            });
        }
        const createdStory = await prisma.story.create({
            data: {
                userId,
                img,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            include: {
                user: true,
            },
        });

        return createdStory;
    } catch (err) {
        console.log(err);
    }
};

export const deletePost = async (postId: number) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        await prisma.post.delete({
            where: {
                id: postId,
                userId,
            },
        });
        revalidatePath("/")
    } catch (err) {
        console.log(err);
    }
};
export const switchLike = async (postId: number) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        const existingLike = await prisma.like.findFirst({
            where: {
                postId,
                userId,
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
        } else {
            await prisma.like.create({
                data: {
                    postId,
                    userId,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong");
    }
};



// Ensure you have proper imports and configurations in place

export async function toggleCommentLike(commentId: number) {


    const { userId } = auth();
    if (!userId) throw new Error("User is not authenticated!");

    try {
        // Check if the user has already liked the comment
        const existingLike = await prisma.like.findFirst({
            where: {
                commentId: commentId,
                userId: userId,
            },
        });

        if (existingLike) {
            // If the like exists, remove it (unlike)
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });


        } else {
            // If the like doesn't exist, add it (like)
            await prisma.like.create({
                data: {
                    commentId: commentId,
                    userId: userId,
                },

            });


        }
    } catch (error) {
        console.error("Error toggling like:", error);
        throw new Error("Something went wrong")
    }
}

export const deleteComment = async (commentId: number) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        await prisma.comment.delete({
            where: {
                id: commentId,
                userId,
            },
        });
        revalidatePath("/")
    } catch (err) {
        console.log(err);
    }
};
export const deleteReply = async (replyId: number) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        await prisma.reply.delete({
            where: {
                id: replyId,
                userId,
            },
        });
        revalidatePath("/")
    } catch (err) {
        console.log(err);
    }
};
export const getLike = async (commentId: number) => {
    const count = await prisma.like.count({
        where: { commentId }
    })

    return count
}

export const checkIfUserLiked = async (commentId: number): Promise<boolean> => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");
    const like = await prisma.like.findFirst({
        where: {
            commentId: commentId,
            userId: userId,
        },
    });

    return !!like;
}

export const addVideo = async (thumbnail: string, video: string) => {
    const { userId } = auth()
    if (!userId) throw new Error("User is not authenticated!");
    await prisma.video.create({
        data: {
            video: video,
            thumbnail: thumbnail,
            userId: userId
        }
    })

}
export const fetchFollower = async () => {
    const { userId } = auth();
    if (!userId) throw new Error("User is not authenticated!");
try {
    
        const followers = await prisma.follower.findMany({
            where: {
                followingId: userId,
            },
            include: {
                follower: {
                    select: {
                        id:true,
                        username: true,
                        avatar: true,
                        name: true,
                        surname: true,
    
                    },
                },
            },
        });
        if (followers) {
            return followers
        }
        return null
    
} catch (error) {
    console.log(error)
    throw new Error("Something went Wrong")
}

}
export const sharePost=async(postId:number,receiverIds:string[])=>{
    const { userId } = auth();
    if (!userId) throw new Error("User is not authenticated!");
   try {
     const sharePromises = receiverIds.map(receiverId =>
         prisma.sharePost.create({
           data: {
             postId,
             senderId:userId,
             receiverId,
           },
         })
       );
 
       await Promise.all(sharePromises);
   } catch (error) {
    console.log(error)
    
   }
}
export async function toggleReplyLike(replyId: number) {


    const { userId } = auth();
    if (!userId) throw new Error("User is not authenticated!");

    try {
        // Check if the user has already liked the comment
        const existingLike = await prisma.like.findFirst({
            where: {
                replyId: replyId,
                userId: userId,
            },
        });

        if (existingLike) {
            // If the like exists, remove it (unlike)
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });


        } else {
            // If the like doesn't exist, add it (like)
            await prisma.like.create({
                data: {
                    replyId: replyId,
                    userId: userId,
                },

            });


        }
    } catch (error) {
        console.error("Error toggling like:", error);
        throw new Error("Something went wrong")
    }
}
export const checkIfUserLikedReply = async (replyId: number): Promise<boolean> => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");
    const like = await prisma.like.findFirst({
        where: {
            replyId: replyId,
            userId: userId,
        },
    });

    return !!like;
}
export const fetchFollowing=async()=>{
    const { userId } = auth();
    if (!userId) throw new Error("User is not authenticated!");
    const followings = await prisma.follower.findMany({
        where: {
            followerId: userId,
        },
        include: {
            following: {
                select: {
                    id:true,
                    username:true,
                    avatar:true,
                    name:true,
                    surname:true
                    

                },
            },
        },
    });
    if (followings) {
        return followings
    }
    return null
    
    
}
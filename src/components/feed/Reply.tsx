"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReplyList from './ReplyList';
import { Reply as ReplyType, User } from '@prisma/client';

type ReplyWithUser = ReplyType & { user: User };

export default function Reply({ commentId }: { commentId: number }) {
    const [replies, setReplies] = useState<ReplyWithUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await axios.get(`/api/replies/${ commentId }`);
                setReplies(response.data);
            } catch (error) {
                console.error('Error fetching replies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReplies();
    }, [commentId]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className='flex-1 h-8 p- flex-col '>
            <ReplyList replies={replies} commentId={commentId}  />
        </div>
    );
}

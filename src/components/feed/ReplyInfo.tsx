"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { deleteReply } from '@/lib/actions';

interface ReplyInfoProps {
  replyId: number;
  onDelete: (id: number) => void; // Callback to notify the parent component
}

export default function ReplyInfo({ replyId, onDelete }: ReplyInfoProps) {
  const [open, setOpen] = useState(false);

  // Handle delete action
  const handleDelete = async () => {
    try {
      await deleteReply(replyId);
      onDelete(replyId); // Notify parent component to remove the reply
    } catch (error) {
      console.error('Failed to delete reply:', error);
    }
  };

  return (
    <div className="relative">
      <Image
        src="/more.png"
        alt=""
        width={16}
        height={16}
        className="cursor-pointer w-4 h-4"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
          
          <span className="text-red-500 cursor-pointer" onClick={handleDelete}>
            Delete
          </span>
        </div>
      )}
    </div>
  );
}

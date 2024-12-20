'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import axios from 'axios';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

interface Story {
    id: string;
    img: string;
    userId: string;
    expiresAt: Date;
    user: {
        id: string;
        username: string;
        avatar: string
    };
}

export default function Page() {
    const [stories, setStories] = useState<Story[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    let response
    useEffect(() => {
        const fetchStories = async () => {
            try {
                response = await axios.get('/api/stories');
                console.log(response.data);
                setStories(response.data);
            } catch (error) {
                console.error('Failed to fetch stories:', error);
            }
        };

        fetchStories();
    }, []);

    // console.log(response)


    const nextStory = () => {
        setCurrentIndex((prevIndex) => (prevIndex < stories.length - 1 ? prevIndex + 1 : 0));
    };

    const prevStory = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : stories.length - 1));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            nextStory();
        }, 5000); // Auto-advance after 5 seconds

        return () => clearTimeout(timer); // Clear timeout on unmount
    }, [currentIndex]);

    if (stories.length === 0) {
        return <div>No stories available</div>;
    }

    return (
        <div className="absolute min-w-screen min-h-screen overflow-auto flex-1 top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50 container  scrollbar-hide">
            <div className="relative bg-white max-w-1/3 max-h-[90vh] rounded-lg flex  justify-center  items-center">
                <div className=" absolute top-1/2 right-[22rem]  w-1/2 h-full" onClick={prevStory}><FaChevronCircleLeft size={40} /></div>

                <div className="relative w-full h-full  flex flex-col">
                    <Image
                        src={stories[currentIndex].user.avatar || "/noAvatar.png"}
                        alt=""
                        width={50}
                        height={50}
                        className="rounded-full w-14 h-14 absolute left-[42%] -top-11    shadow-md z-10 object-cover"
                    />
                    <Image
                        src={stories[currentIndex]?.img || ""}
                        height={380}
                        width={380}
                        objectFit="cover"
                        alt="Story"
                        className="w-full h-full rounded-lg"
                    />
                </div>

                {/* Progress Bar */}
                <div className="absolute top-4 left-0 w-full flex space-x-1 px-4">
                    {stories.map((story, index) => (
                        <div
                            key={index}
                            className={`h-1 flex-1 bg-gray-300 ${index <= currentIndex ? 'bg-white' : ''}`}
                        ></div>
                    ))}
                </div>

                <div className=" absolute top-1/2 left-[31.25rem] w-1/2 h-full" onClick={nextStory}><FaChevronCircleRight size={40} /></div>
                {/* Navigation */}
            </div>
        </div>
    );
};

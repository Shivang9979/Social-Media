import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from './MobileMenu'
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export const Navbar = () => {
    return (
        <div className='flex items-center justify-between h-24'>
            {/* LEFT */}
            <div className='lg:block w-[20%] md:hidden'>
                <Link href="/" className='font-bold text-pink-500 text-xl'>Social Media</Link>
            </div>
            {/* Center */}
            <div className='hidden md:flex w-[50%] text-sm items-center justify-between scrollbar-hidden'>
                <div className='flex gap-6 text-gray-600'>
                    <Link href="/" className='flex gap-2'>
                        <Image src="/home.png" alt="HomePage" width={16} height={16} className='w-4 h-4' />
                        <span>HomePage</span>
                    </Link>
                    <Link href="/" className='flex gap-2'>
                        <Image src="/friends.png" alt="Friends" width={16} height={16} className='w-4 h-4' />
                        <span>Friends</span>
                    </Link>
                    <Link href="/stories" className='flex gap-2'>
                        <Image src="/stories.png" alt="Stories" width={16} height={16} className='w-4 h-4' />
                        <span>Stories</span>
                    </Link>
                </div>
                <div className='hidden xl:flex p-2 bg-slate-100 items-center rounded-xl'>
                    <input type="text" placeholder='search...' className='bg-transparent outline-none'/>
                    <Image src="/search.png" alt='' width={14} height={14}/>
                </div>
            </div>
            {/* Right */}
            <div className='w-[30%] flex items-center gap-4 xl:gap-8 justify-end'>
                <ClerkLoading>
                    <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
                        <svg className="w-6 h-6 animate-spin text-gray-900/50" viewBox="0 0 64 64" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                                stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path
                                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                                stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <div className='cursor-pointer'>
                            <Image src="/people.png" width={24} height={24} alt=''  className='w-5 h-5' />
                        </div>
                        <div className='cursor-pointer'>
                            <Image src="/messages.png" width={20} height={20} alt=''  className='w-5 h-5' />
                        </div>
                        <div className='cursor-pointer'>
                            <Image src="/notifications.png" width={20} height={20} alt=''   className='w-5 h-5'/>
                        </div>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <div className='flex items-center gap-2 text-sm'>
                            <Image src="/login.png" alt='' width={20} height={20} />
                            <Link href="/sign-in">Login/Register</Link>
                        </div>
                    </SignedOut>
                </ClerkLoaded>
                <MobileMenu />
            </div>
        </div>
    )
}

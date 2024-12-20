import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
export default function Birthday() {
  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm  flex flex-col gap-4'>
      <div className='flex justify-between items-center font-medium '>
        <span className=' text-gray-500'>Birthdays</span>
        
      </div>
      <div className='flex items-center justify-between mt-4'>
        <div className='flex items-center gap-4'>
          <Image src="https://images.pexels.com/photos/11643548/pexels-photo-11643548.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" height={40} width={40} className="w-10 h-10 rounded-full object-cover " />
          <span className='font-semibold'>Shivang</span>
        </div>
        <div className='flex gap-3 justify-end'>
          <button className='bg-pink-500 text-white text-xs px-2 py-1 rounded-md'>Celebrate</button>
        </div>
      </div>
      <div className='p-4 bg-slate-100 rounded-lg flex items-center gap-4 '>
      <Image src="/gift.png" alt="" height={24} width={24} />
      <Link href="/" className='flex flex-col gap-1 text-xs '>
      <span className='text-grey-700 font-semibold'>Upcoming Birthdays</span>
      <span className='text-gray-500'>See other birthdays</span>
      </Link>
      </div>
    </div>
  )
}

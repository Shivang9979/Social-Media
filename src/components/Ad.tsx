import React from 'react'
import Image from 'next/image'

export default function Ad({size}:{size:"sm"|"md"|"lg"}) {
  return (
    <div className='p-4 bg-white rounded-lg shadow-md text-sm'>
      <div className='flex items-center justify-between text-gray-500 font-medium '>
        <span>
          Sponsered Ads
        </span>
        <Image src="/more.png" alt="" width={16} height={16}/>
      </div>
      <div className={`flex flex-col mt-4 ${size === "sm" ? "gap-2":"gap-4"} `}>
        <div className={`relative w-full ${size==="sm" ? "h-24 ": size==="md"?"h-36":"h-48"}`}>
          <Image src="https://images.pexels.com/photos/11643548/pexels-photo-11643548.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt='' fill className='rounded-lg object-cover'/>

        </div>
        <div className='flex items-center gap-4 '>
          <Image src="https://images.pexels.com/photos/11643548/pexels-photo-11643548.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" width={24} height={24} className='rounded-full w-6 h-6 object-cover'/>
          <span className='text-pink-500 font-medium'>Shivang</span>
        </div>
        <p className={`${size==="sm"?"text-xs":"text-sm"}`}>
          
             {size ==="sm" ? "lorem12":size==="md" ? "lorem12" :"lorem12"}
          
        </p>
        <button className='bg-gray-200 text-gray-500 p-2 text-xs  rounded-lg'>Learn More</button>
      </div>

    </div>
  )
}

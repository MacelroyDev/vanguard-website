'use client'
import Image from 'next/image'
import Link from 'next/link'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel'
import { useState } from 'react';

export default function PopularDestinations() {

    const [imageIndex, setImageIndex] = useState(0);

    const titles = ['Progress','Gentriville','Vanguard City','Magicannot'];

    const descs = [
        "Likely the first stop you will make on your journey into the Server. Watch for open steam vents if you take any of the scenic hiking trails!",
        "Gentriville is the city of enterprise and improvement, if you choose to stop in make sure you swing by the Zeeble Dome, Vanguard's one and only casino experience!",
        "Vanguard City is the epitome of everything the Server stands for. It's beauty, it's grace, and most importantly, it's fun! Hit up the Vanguard Macro-Mart for all your essential shopping needs, or dine in at the Dig In restaurant located on the bottom floor!",
        "(Route closed due to the Vanguard Pulverizer MK. II pulverizing itself into a wall)"
    ]

    return (
        <div className='flex flex-row justify-around'>
            
            <div style={{ width: '40%', height: '90%', position: 'relative' }} className='border-4 border-solid border-vanguardOrange rounded-xl mx-10 mb-10'>
                <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl mt-5 ml-5">Popular Destinations</h1>
                <Carousel className='w-auto h-auto' infiniteLoop='true' onChange={(index) => setImageIndex(index)}>
                    <div>
                        <Image className='m-10 -z-10 relative drop-shadow-xl' alt={'View of Progress'} src={'/images/pb-progress.png'} width='1920' height='1080' style={{ width: '70%', height: '70%' }}/>
                    </div>
                    <div>
                        <Image className='m-10 -z-10 relative drop-shadow-xl' alt={'View of Gentriville'} src={'/images/pb-gentriville.png'} width='1920' height='1080' style={{ width: '70%', height: '70%' }}/>
                    </div>
                    <div>
                        <Image className='m-10 -z-10 relative drop-shadow-xl' alt={'View of Vanguard City'} src={'/images/pb-vanguard-city.png'} width='1920' height='1080' style={{ width: '70%', height: '70%' }}/>
                    </div>
                    <div>
                        <Image className='m-10 -z-10 relative drop-shadow-xl' alt={'View of Magicannot Station'} src={'/images/pb-magicannot.png'} width='1920' height='1080' style={{ width: '70%', height: '70%' }}/>
                    </div>
                </Carousel>
            </div>
            <div style={{ width: '50%', height: '90%', position: 'relative' }} className='border-4 border-solid border-vanguardOrange rounded-xl mr-10 mb-10'>
                <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5">{titles[imageIndex]}</h1>
                <ul>
                    <li className="text-sm text-white font-(vanguardFont) drop-shadow-xl mt-2 mb-5 mx-5">
                        {descs[imageIndex]}
                    </li>
                </ul>
            </div>
        </div>
    )
}
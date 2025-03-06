import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {

//<Image className='drop-shadow-vanguard-shadow mt-5' alt={'Vanguard Nav Logo'} src={'/images/vanguard-v.png'} width='256' height='256'></Image>

    return(
        <div className='sticky top-0 bg-[#E2D3B4] drop-shadow-xl'>
            <Image className='fixed z-99' alt={'Vanguard 45 Logo'} src={'/images/vanguard-45-2.png'} width='150' height='150'></Image>
            <div className='z-98'>
                <div className='w-96 h-8 bg-[#fec633] -rotate-45'/>
                <div className='drop-shadow-vanguard-shadow w-auto h-8 ml-40 bg-[#fec633]'/>
                <div className='flex flex-row justify-left align-middle drop-shadow-vanguard-shadow w-auto h-8 my-5 ml-28 p-1 bg-[#fec633]'>
                    <ul className='list-none ml-10'>
                        <li className="text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"><Link href={{pathname:'/'}}>Home</Link></li>
                        <li className="text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"><Link href={{pathname:'/'}}>Travel</Link></li>
                        <li className="text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"><Link href={{pathname:'/'}}>Maps</Link></li>
                        <li className="text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"><Link href={{pathname:'/'}}>Cards</Link></li>
                    </ul>
                </div>
                <div className='drop-shadow-vanguard-shadow w-auto h-8 bg-[#fec633]'/>
            </div>
        </div>
    )
}
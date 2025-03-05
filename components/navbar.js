import Image from 'next/image'

export default function Navbar() {

//<Image className='drop-shadow-vanguard-shadow mt-5' alt={'Vanguard Nav Logo'} src={'/images/vanguard-v.png'} width='256' height='256'></Image>

    return(
        <div>
            <div className='drop-shadow-vanguard-shadow w-auto h-5 bg-[#fec633]'/>
            <div className='flex flex-row justify-left'>
                <ul className='list-none p-2'>
                    <li className="text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"><a>Home</a></li>
                    <li className="text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"><a>About</a></li>
                    <li className="text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"><a>Travel</a></li>
                    <li className="text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"><div className='w-auto h-5 bg-[#fec633]'/></li>
                </ul>
            </div>
            <div className='drop-shadow-vanguard-shadow w-auto h-5 bg-[#fec633]'/>
        </div>
    )
}
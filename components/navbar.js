import Image from 'next/image'
import Link from 'next/link'

export default function Navbar({ pathname }) {

    const colorMap = {
        '/': '#E2D3B4', // Home
        '/travel': '#030306', // Travel
        '/maps': '#617AA8', // Maps
        '/cards': '#84AFFF' // Cards
    };

    function getLinkStyle(href){
        if (pathname === href) {
            return "text-xl font-(vanguardFont) drop-shadow-xl inline mx-5 text-red-600"
        } else {
            return "text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"
        }
    }

    const backgroundColor = colorMap[pathname] || '#E2D3B4';

    return(
        <div className='drop-shadow-xl' style={{ backgroundColor }}>
            <Image className='fixed z-99' alt={'Vanguard 45 Logo'} src={'/images/vanguard-45-2.png'} width='150' height='150'></Image>
            <div className='z-98'>
                <div className='w-96 h-8 bg-[#fec633] -rotate-45'/>
                <div className='drop-shadow-vanguard-shadow w-auto h-8 ml-40 bg-[#fec633]'/>
                <div className='flex flex-row justify-left align-middle drop-shadow-vanguard-shadow w-auto h-8 my-5 ml-28 p-1 bg-[#fec633]'>
                    <ul className='list-none ml-10'>
                        <li className={getLinkStyle("/")}><Link href={{pathname:'/'}}>Home</Link></li>
                        <li className={getLinkStyle("/travel")}><Link href={{pathname:'./travel'}}>Travel</Link></li>
                        <li className={getLinkStyle("/maps")}><Link href={{pathname:'./maps'}}>Maps</Link></li>
                        <li className={getLinkStyle("/cards")}><Link href={{pathname:'./cards'}}>Cards</Link></li>
                    </ul>
                </div>
                <div className='drop-shadow-vanguard-shadow w-auto h-8 bg-[#fec633]'/>
            </div>
        </div>
    )
}
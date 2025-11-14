import Image from 'next/image'
import Link from 'next/link'

interface NavbarProps {
    pathname: string;
}

export default function Navbar(props: NavbarProps) {

    function getLinkStyle(href: string){
        if (props.pathname === href) {
            return "text-xl font-(vanguardFont) drop-shadow-xl inline mx-5 text-red-600"
        } else {
            return "text-xl font-(vanguardFont) drop-shadow-xl inline mx-5"
        }
    }


    return(
        <div className='drop-shadow-xl overflow-x-hidden' style={{ backgroundColor:'#393B3E' }}>
            <div className='z-98'>
                <div className='flex flex-row justify-left align-middle drop-shadow-vanguard-shadow w-auto h-8 my-5 ml-28 p-1'>
                    <ul className='list-none ml-10'>
                        <li className={getLinkStyle("/")}><Link href={{pathname:'/'}}>Home</Link></li>
                        <li className={getLinkStyle("/travel")}><Link href={{pathname:'./travel'}}>Travel</Link></li>
                        <li className={getLinkStyle("/maps")}><Link href={{pathname:'./maps'}}>Maps</Link></li>
                        <li className={getLinkStyle("/cards")}><Link href={{pathname:'./cards'}}>Cards</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
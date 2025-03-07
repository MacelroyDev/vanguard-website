import ClientNavbarNavbar from '../../components/clientNavbar'
import Image from 'next/image'
import CardImages from '@/components/cardList';

export default function Travel() {


    return (
      <main>
        <ClientNavbarNavbar/>
        <Image className='mr-20 -z-10 relative' alt={"Temp Banner"} src={'/images/zeeble-dome.png'} width='2500' height='2500' style={{ width: '100%', height: 'auto' }}/>

        <div style={{ width: '100%', height: '100%', position: 'relative'}} className='flex flex-col justify-start my-20 z-10'>
            <div style={{ width: '60%', height: '90%', position: 'relative'}} className='border-4 border-hidden border-vanguardOrange rounded-xl ml-10 mb-10'>
                <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5">Trading Cards</h1>
                <p className="text-sm text-white font-(vanguardFont) drop-shadow-xl m-5">
                  Scattered around the Server are various VANGUARD TRADING CARDS! ©
                  Look out for a lodestone and you might just find one!
                </p>
                <p className="text-sm text-white font-(vanguardFont) drop-shadow-xl m-5">
                  Read more about VANGUARD TRADING CARDS! © on the <a className='text-vanguardOrange underline' href='./travel'>Travel</a> page.
                </p>
                <p className="text-xs text-gray font-(vanguardFont) drop-shadow-xl m-10">
                  Holographic cards have been temporarily hidden for the time being, we are not sorry for the inconvenience.
                </p>
            </div>
            <CardImages/>
        </div>

        
      </main>
    );
  }


import Soon from './beta/soon'
import Navbar from '../components/navbar'
import Image from 'next/image'

export default function Home() {


    return (
      <main>
        <Navbar/>
        <Image className='drop-shadow-xl mr-20' alt={'Vanguard City'} src={'/images/vanguard-city.png'} width='2500' height='2500' style={{ width: '100%', height: 'auto' }}></Image>
        <Soon/>
      </main>
    );
  }



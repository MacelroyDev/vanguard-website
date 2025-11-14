import Soon from './beta/soon'
import ClientNavbarNavbar from '../components/clientNavbar'
import Image from 'next/image'

export default function Home() {


    return (
      <main>
        <ClientNavbarNavbar/>
        <Image className='-z-10 relative' alt={'Vanguard City'} src={'/images/vanguard-city.png'} width='2500' height='2500' style={{ width: '100%', height: 'auto' }}/>

        <div style={{ width: '100%', height: '100%', position: 'relative'}}>
          <Soon/>
        </div>

        
      </main>
    );
  }

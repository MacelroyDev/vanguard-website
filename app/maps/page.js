import ClientNavbarNavbar from '../../components/clientNavbar'
import Image from 'next/image'

export default function Travel() {


    return (
      <main>
        <ClientNavbarNavbar/>
        <Image className='mr-20 -z-10 relative' alt={"View of Progress from Vanguard"} src={'/images/map-page.png'} width='2500' height='2500' style={{ width: '100%', height: 'auto' }}/>

        <div style={{ width: '100%', height: '100%', position: 'relative'}} className='flex flex-col justify-start my-20 z-10'>
            <div style={{ width: '60%', height: '90%', position: 'relative'}} className='border-4 border-hidden border-vanguardOrange rounded-xl ml-10 mb-10'>
                <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5">Map Links</h1>
                <a className="text-md text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5 underline" href="http://23.17.34.171:3876/">Train Map</a>
                <br></br>
                <a className="text-md text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5 underline" href="http://23.17.34.171:8123/">Server Map</a>
            </div>
        </div>

        
      </main>
    );
  }


 // bg-gradient-to-b from-transparent via-transparent to-pink-500
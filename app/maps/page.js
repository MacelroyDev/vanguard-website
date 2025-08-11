import ClientNavbarNavbar from '../../components/clientNavbar'
import Image from 'next/image'

export default function Travel() {


    return (
      <main>
        <ClientNavbarNavbar/>
        <Image className='-z-10 relative' alt={"View of Progress from Vanguard"} src={'/images/map-page.png'} width='2500' height='2500' style={{ width: '100%', height: 'auto' }}/>

        <div style={{ width: '100%', height: '100%', position: 'relative'}} className='flex flex-col justify-start my-20 z-10'>

            <div style={{ width: '60%', height: '90%', position: 'relative'}} className='border-4 border-hidden border-vanguardOrange rounded-xl mx-auto mb-10'>
              <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5 text-center">Server Map</h1>
              <a className="text-sm text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5 underline text-center" href="http://23.17.34.171:8123/" target="_blank">Server Map Link</a>
              <iframe src="http://23.17.34.171:8123/" allowFullScreen={true} width="100%" height="500" className='mt-5'>
              </iframe>
            </div>

            <div style={{ width: '60%', height: '90%', position: 'relative'}} className='border-4 border-hidden border-vanguardOrange rounded-xl mx-auto mb-10'>
              <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5 text-center">Train Map</h1>
              <a className="text-sm text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5 underline text-center" href="http://23.17.34.171:3876/" target="_blank">Train Map Link</a>
              <iframe src="http://23.17.34.171:3876/" allowFullScreen={true} width="100%" height="500" className='mt-5'>
              </iframe>
            </div>

            
        </div>

        
      </main>
    );
  }


 // bg-gradient-to-b from-transparent via-transparent to-pink-500
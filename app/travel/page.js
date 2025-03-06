import ClientNavbarNavbar from '../../components/clientNavbar'
import Image from 'next/image'

export default function Travel() {


    return (
      <main>
        <ClientNavbarNavbar/>
        <Image className='mr-20 -z-10 relative' alt={'Vanguard Space Port'} src={'/images/spaceport.png'} width='2500' height='2500' style={{ width: '100%', height: 'auto' }}/>

        <div style={{ width: '100%', height: '100%', position: 'relative'}} className='flex flex-col justify-start my-20 z-10'>
            <div style={{ width: '60%', height: '90%', position: 'relative'}} className='border-4 border-solid border-vanguardOrange rounded-xl ml-10 mb-10'>
                <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5">Introduction</h1>
                <p className="text-sm text-white font-(vanguardFont) drop-shadow-xl m-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Vestibulum in sollicitudin tellus. Duis ac posuere eros. Cras non lacus ultricies, pharetra mauris a, porttitor augue. 
                    In nisi sapien, aliquam et est non, rutrum euismod metus. Curabitur tincidunt auctor est, ac tristique nisi ornare eu. 
                    Donec sit amet turpis molestie, viverra nibh nec, dictum ipsum. Maecenas vitae dapibus leo. Sed rutrum placerat nisi vel lacinia.
                </p>
            </div>
            <div style={{ width: '60%', height: '90%', position: 'relative'}} className='border-4 border-solid border-vanguardOrange rounded-xl mr-10 mb-10 self-end'>
                <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5">Popular Destinations</h1>
                <p className="text-sm text-white font-(vanguardFont) drop-shadow-xl m-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Vestibulum in sollicitudin tellus. Duis ac posuere eros. Cras non lacus ultricies, pharetra mauris a, porttitor augue. 
                    In nisi sapien, aliquam et est non, rutrum euismod metus. Curabitur tincidunt auctor est, ac tristique nisi ornare eu. 
                    Donec sit amet turpis molestie, viverra nibh nec, dictum ipsum. Maecenas vitae dapibus leo. Sed rutrum placerat nisi vel lacinia.
                </p>
            </div>
            <div style={{ width: '60%', height: '90%', position: 'relative'}} className='border-4 border-solid border-vanguardOrange rounded-xl ml-10 mb-10'>
                <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5">Collectables</h1>
                <p className="text-sm text-white font-(vanguardFont) drop-shadow-xl m-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Vestibulum in sollicitudin tellus. Duis ac posuere eros. Cras non lacus ultricies, pharetra mauris a, porttitor augue. 
                    In nisi sapien, aliquam et est non, rutrum euismod metus. Curabitur tincidunt auctor est, ac tristique nisi ornare eu. 
                    Donec sit amet turpis molestie, viverra nibh nec, dictum ipsum. Maecenas vitae dapibus leo. Sed rutrum placerat nisi vel lacinia.
                </p>
            </div>
        </div>

        
      </main>
    );
  }


 // bg-gradient-to-b from-transparent via-transparent to-pink-500
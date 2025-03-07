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
                <p className="text-sm text-white font-(vanguardFont) drop-shadow-xl m-5">
                    The Server utilizes automated trains and boats to help players travel long distances.
                    The ETA listed on the display boards found around each station is the only correct time. 
                    Please ignore everything else on the boards as due to errors they may display incorrect information.
                    Available externally is a <a className='text-vanguardOrange underline' href="http://23.17.34.171:3876/" target="_blank">map</a> of all the trains and boats currently running and how far along their route they are, 
                    as well as a <a className='text-vanguardOrange underline' href="http://23.17.34.171:8123/" target="_blank">3D map</a> of the Server as it's known!
                </p>
            </div>
            <div style={{ width: '60%', height: '90%', position: 'relative'}} className='border-4 border-solid border-vanguardOrange rounded-xl mr-10 mb-10 self-end'>
                <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5">Popular Destinations</h1>
                <ul>
                    <li className="text-sm font-bold text-white font-(vanguardFont) drop-shadow-xl mt-5 mx-5">- Progress</li>
                    <li className="text-sm text-white font-(vanguardFont) drop-shadow-xl mt-2 mx-5">
                        Likely the first stop you will make on your journey into the Server. Watch for open steam vents if you take any of the scenic hiking trails!
                    </li>
                    <li className="text-sm font-bold text-white font-(vanguardFont) drop-shadow-xl mt-5 mx-5">- Gentriville</li>
                    <li className="text-sm text-white font-(vanguardFont) drop-shadow-xl mt-2 mx-5">
                        Gentriville is the city of enterprise and improvement, if you choose to stop in make sure you swing by the Zeeble Dome, Vanguard's one and only casino experience!
                    </li>
                    <li className="text-sm font-bold text-white font-(vanguardFont) drop-shadow-xl mt-5 mx-5">- Vanguard City</li>
                    <li className="text-sm text-white font-(vanguardFont) drop-shadow-xl mt-2 mx-5">
                        Vanguard City is the epitome of everything the Server stands for. It's beauty, it's grace, and most importantly, it's fun! Hit up the Vanguard Macro-Mart for all your essential shopping needs, or dine in at the Dig In restaurant located on the bottom floor!
                    </li>
                    <li className="text-sm font-bold text-white font-(vanguardFont) drop-shadow-xl mt-5 mx-5">- Magicannot</li>
                    <li className="text-sm text-white font-(vanguardFont) drop-shadow-xl mt-2 mx-5 mb-5">
                        (Route closed due to the Vanguard Pulverizer pulverizing itself into a wall)
                    </li>
                </ul>
            </div>
            <div className='flex flex-row'>
                <div style={{ width: '60%', height: '90%', position: 'relative'}} className='border-4 border-solid border-vanguardOrange rounded-xl ml-10 mb-10'>
                    <h1 className="text-3xl text-vanguardOrange font-(vanguardFont) drop-shadow-xl m-5">Collectables</h1>
                    <p className="text-sm text-white font-(vanguardFont) drop-shadow-xl m-5">
                        Scattered around the Server are various landmarks, look out for a Lodestone and you just might find a souvenir in the form of a VANGUARD TRADING CARDS © ! 
                        See if you can collect and catalogue them all! (Catalogues available at Spawn Station free of charge!)
                    </p>
                    <p className="text-sm text-white font-(vanguardFont) drop-shadow-xl m-5">
                        That's not all for fun collectibles however! While you're exploring the deep underbelly of the Server make sure you keep your eye out for 
                        <span className='freaky-font text-lg'> Cume Chalices</span>!
                        They're much more of a challenge to find!
                    </p>
                </div>
                <Image className='m-10 -z-10 relative drop-shadow-xl' alt={'Minecraft Lodestone'} src={'/images/lodestone.png'} width='300' height='300' style={{ width: '20%', height: '20%' }}/>
            </div>
        </div>

        
      </main>
    );
  }


 // bg-gradient-to-b from-transparent via-transparent to-pink-500
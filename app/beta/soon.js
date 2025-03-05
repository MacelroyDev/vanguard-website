import Image from 'next/image'

function Soon() {


    return (
        <div className='flex flex-col justify-center items-center'>
            <div style={{width: '50%', height: '50%'}}>
                <Image className='drop-shadow-vanguard-shadow mr-20' alt={'Vanguard Alt Logo'} src={'/images/vanguard-cyber.png'} width='512' height='512'></Image>
            </div>
            <h1 className="text-3xl font-(vanguardFont) drop-shadow-xl">We'll be with you soon.</h1>
        </div>
    );
}


export default Soon;
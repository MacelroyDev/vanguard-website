import Image from 'next/image'

function Soon() {


    return (
        <div className='flex flex-col justify-center items-center'>
            <div>
                <Image className='drop-shadow-vanguard-shadow' alt={'Vanguard Alt Logo'} src={'/images/vanguard-cyber.png'} width='512' height='512'></Image>
            </div>
            <h1 className="text-3xl font-(vanguardFont) drop-shadow-xl mb-10">We'll be with you soon.</h1>
            <p className="text-sm font-(vanguardFont) drop-shadow-xl mb-10">© Copyright Vanguard Extraction Solutions 2025</p>
        </div>
    );
}


export default Soon;
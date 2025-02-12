import Link from 'next/link'

export default function Home() {

  const imageURL = "https://cdn.discordapp.com/attachments/356543230809997324/1334960971739041852/Picsart_25-01-31_10-57-25-171.png?ex=67ae40ca&is=67acef4a&hm=cae6807168e42edb46af1f4e218bf1322251304ac9042a5640389f303724a646&"

    return (
      <main>
        <div className='flex flex-col text-center'>
          <img className='mx-auto drop-shadow-vanguard-shadow' src={imageURL} width='25%' height='25%'></img>
          <h1 className="text-3xl m-6 font-(vanguardFont) drop-shadow-xl">We'll be with you soon.</h1>
        </div>
        
      </main>
    );
  }



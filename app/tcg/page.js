"use client"
import { useState, useRef } from 'react';
import ClientNavbar from '../../components/clientNavbar';
import TradingCard from '../../components/TradingCard';
import html2canvas from 'html2canvas';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Link from 'next/link'

export default function Tcg() {
  const defualtDesc = `*ability*Example Ability / Do something when something. Line break is 31 line characters.
  ───────────────────────────────
  [*splat**splat* Example Attack / 20] Discard 1 *splat* aura from your opponent\'s active critter.
  `;
  // The backslash is so the apostrophe doesnt close the string

  const linebreak = "───────────────────────────────";

  const [cardName, setCardName] = useState('Name');
  const [description, setDescription] = useState(defualtDesc);
  const [energyType, setEnergyType] = useState('Splat');
  const [rarity, setRarity] = useState('Common');
  const [category, setCategory] = useState('Denizen');
  const [hp, setHP] = useState(100);
  const [retreat, setRetreat] = useState(2);
  const [cardImage, setCardImage] = useState(null);
  const [skobian, setSkobian] = useState(false);
  const [littleguy, setLittleguy] = useState(false);
  const [level,setLevel] = useState(1);

  // State for image sliders
  const [imageZoom, setImageZoom] = useState(1);
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);

  const cardRef = useRef(null);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (cardRef.current) {
      const cardElement = cardRef.current;

      html2canvas(cardElement, {
        width: cardElement.offsetWidth,
        height: cardElement.offsetHeight,
        scale: 2, // Use a high scale for better quality
        useCORS: true, // This is crucial for images loaded from different origins (e.g., user uploads)
      }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${cardName.replace(/\s/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  // Reset functions for each slider
  const resetZoom = () => setImageZoom(1);
  const resetX = () => setImageX(0);
  const resetY = () => setImageY(0);

  return (
    <main>
      <ClientNavbar />
      <div className="flex p-4 gap-8">
        <div className="w7/16"> {/* 7/16 fraction so slightly less than half*/}
          <h2 className="text-2xl text-vanguardOrange font-(vanguardFont) font-bold drop-shadow-xl mt-5">Bodob Skobis TCG Card Editor</h2>
          <Link 
            type="button" 
            className='block border-4 border-vanguardOrange p-2 rounded-md text-sm text-vanguardOrange font-(vanguardFont) drop-shadow-xl mt-5 mb-10'
            href={{pathname:'./tcg/supporter'}}
          >
            Switch to supporter card
          </Link>
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-white">Card Name</label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md font-[skobisFont]"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white">Category</label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md font-[skobisFont]"
              />
            </div>

            <div>
              <label htmlFor="rarity" className="block text-sm font-medium text-white">Rarity</label>
              <select
                id="rarity"
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md font-[skobisFont]"
              >
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
                <option value="Exquisite">Exquisite</option>
              </select>
            </div>

            <div>
              <label htmlFor="energyType" className="block text-sm font-medium text-white">Energy Type</label>
              <select
                id="energyType"
                value={energyType}
                onChange={(e) => setEnergyType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md font-[skobisFont]"
              >
                <option value="Splat">Splat</option>
                <option value="Rage">Rage</option>
                <option value="Whimsy">Whimsy</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Terra">Terra</option>
              </select>
            </div>

            {/* Div for HP and Retreat inputs */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="hp" className="block text-sm font-medium text-white">HP</label>
                    <input
                        id="hp"
                        type="number"
                        value={hp}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value) && value % 10 === 0) {
                                setHP(value);
                            }
                        }}
                        step="10"
                        min="10"
                        className="mt-1 block w-full border border-gray-300 p-2 rounded-md font-[skobisFont]"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="retreat" className="block text-sm font-medium text-white">Retreat Cost</label>
                    <input
                        id="retreat"
                        type="number"
                        value={retreat}
                        onChange={(e) => setRetreat(parseInt(e.target.value, 10))}
                        min="0"
                        className="mt-1 block w-full border border-gray-300 p-2 rounded-md font-[skobisFont]"
                    />
                </div>
            </div>

            {/* Div for Level and Linebreak inputs */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="level" className="block text-sm font-medium text-white">Level</label>
                    <input
                        id="level"
                        type="number"
                        value={level}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!isNaN(value) && value >= 0 && value <= 3) {
                                setLevel(value);
                            }
                        }}
                        step="1"
                        min="0"
                        max="3"
                        className="mt-1 block w-full border border-gray-300 p-2 rounded-md font-[skobisFont]"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="Linebreak" className="block text-sm font-medium text-white">Copy Linebreak</label>
                    <button
                        type="button"
                        className="mt-1 block w-full border border-gray-300 p-2 rounded-md font-[skobisFont] bg-white"
                        onClick={() => {
                          navigator.clipboard.writeText(linebreak)
                          .then(() => {
                              console.log('Linebreak copied to clipboard!');
                              // Optionally, you can add a user notification here
                          })
                          .catch(err => {
                              console.error('Failed to copy text: ', err);
                          });
                        }}
                    >
                      Copy
                    </button>
                </div>
            </div>
            <div>
              <div className="flex gap-2">
                <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
                <IoMdInformationCircleOutline  data-tooltip-id="desc-tooltop" color='#fec633'/>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md font-[skobisFont]"
                rows="5"
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                id="skobian-checkbox"
                type="checkbox"
                checked={skobian}
                onChange={(e) => setSkobian(e.target.checked)}
                className="h-4 w-4 text-vanguardOrange border-gray-300 rounded focus:ring-vanguardOrange"
              />
              <label htmlFor="skobian-checkbox" className="block text-sm font-medium text-white">
                Is Skobian?
              </label>
              <input
                id="littleguy-checkbox"
                type="checkbox"
                checked={littleguy}
                onChange={(e) => setLittleguy(e.target.checked)}
                className="h-4 w-4 text-vanguardOrange border-gray-300 rounded focus:ring-vanguardOrange"
              />
              <label htmlFor="skobian-checkbox" className="block text-sm font-medium text-white">
                Is Little Guy?
              </label>
            </div>

            <div>
              <label htmlFor="cardImage" className="block text-sm font-medium text-white">Card Image</label>
              <input
                id="cardImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full"
              />
            </div>


            {/* Zoom and pan inputs */}
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <label className="block whitespace-nowrap min-w-[120px] text-white">Zoom: {imageZoom.toFixed(2)}</label>
                    <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={imageZoom}
                        onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                        className="w-64"
                    />
                    <button
                        type="button"
                        onClick={resetZoom}
                        className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Reset
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <label className="block whitespace-nowrap min-w-[120px] text-white">Pan X: {imageX}px</label>
                    <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={imageX}
                        onChange={(e) => setImageX(parseInt(e.target.value))}
                        className="w-64"
                    />
                    <button
                        type="button"
                        onClick={resetX}
                        className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Reset
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <label className="block whitespace-nowrap min-w-[120px] text-white">Pan Y: {imageY}px</label>
                    <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={imageY}
                        onChange={(e) => setImageY(parseInt(e.target.value))}
                        className="w-64"
                    />
                    <button
                        type="button"
                        onClick={resetY}
                        className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Reset
                    </button>
                </div>
            </div>
          </form>
          <button
            type="button"
            onClick={handleDownload}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Card
          </button>
        </div>

        <div className="w-1/2 flex justify-center items-center">
          <div ref={cardRef} className="w-[320px] h-[480px]">
            <TradingCard
              name={cardName}
              description={description}
              energy={energyType}
              cardImage={cardImage}
              rarity={rarity}
              category={category}
              hp={hp}
              retreat={retreat}
              imageZoom={imageZoom}
              imageX={imageX}
              imageY={imageY}
              skobian={skobian}
              littleguy={littleguy}
              level={level.toString()}
            />
          </div>
        </div>
      </div>
      <ReactTooltip id="desc-tooltop" place="right">
        <p className='max-w-sm'>
          By surrounding the name of an energy type with * * you can add icons to the description box.
        </p>
        <p className='max-w-sm'>
          Examples:
        </p>
        <ul className='max-w-sm list-disc'>
          <li className='ml-8'>*splat*</li>
          <li className='ml-8'>*rage*</li>
          <li className='ml-8'>*whimsy*</li>
          <li className='ml-8'>*mechanical*</li>
          <li className='ml-8'>*terra*</li>
        </ul>
      </ReactTooltip>
    </main>
  );
}
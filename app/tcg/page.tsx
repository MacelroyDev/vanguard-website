"use client"
import { useState, useRef, ChangeEvent } from 'react';
import TradingCard from '../../components/TradingCard';
import html2canvas from 'html2canvas';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Link from 'next/link'

type EnergyType = 'Splat' | 'Rage' | 'Whimsy' | 'Mechanical' | 'Terra';
type RarityType = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Exquisite';
type EnergyCostType = 'None' | 'Splat' | 'Rage' | 'Whimsy' | 'Mechanical' | 'Terra' | 'SplatFinal';

export default function Tcg() {
  const defaultDesc = `*ability*Example Ability / Do something when something. Line break is 31 line characters.
  ───────────────────────────────
  [*splat**splat* Example Attack / 20] Discard 1 *splat* aura from your opponent\'s active critter.
  `;
  // The backslash is so the apostrophe doesnt close the string

  const defaultFlavour = `Flavor text is descriptive writing in games that adds story, lore, and atmosphere but doesn't change the game's rules or mechanics.`;

  const linebreak = "───────────────────────────────";

  const [cardName, setCardName] = useState('Name');
  const [description, setDescription] = useState(defaultDesc);
  const [energyType, setEnergyType] = useState<EnergyType>('Splat');
  const [rarity, setRarity] = useState<RarityType>('Common');
  const [category, setCategory] = useState('Denizen');
  const [attack, setAttack] = useState(1);
  const [defence, setDefence] = useState(2);
  const [cardImage, setCardImage] = useState<string>("");
  const [skobian, setSkobian] = useState(false);
  const [littleguy, setLittleguy] = useState(false);
  const [darkner, setDarkner] = useState(false);
  const [title,setTitle] = useState<string>("Title");
  const [ability,setAbility] = useState<string>("Stalwart");
  const [flavourText,setFlavourText] = useState<string>(defaultFlavour);
  const [energyCostA, setEnergyCostA] = useState<EnergyCostType>('None');
  const [energyCostB, setEnergyCostB] = useState<EnergyCostType>('None');
  const [energyCostC, setEnergyCostC] = useState<EnergyCostType>('None');
  const [energyCostD, setEnergyCostD] = useState<EnergyCostType>('None');
  const [energyCostE, setEnergyCostE] = useState<EnergyCostType>('None');
  const [energyCostNum, setEnergyCostNum] = useState(1);

  // State for image sliders
  const [imageZoom, setImageZoom] = useState(1);
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardImage(reader.result as string);
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
    <main className="bg-zinc-900 min-h-screen">
      <div className="flex p-8 gap-8 max-w-7xl mx-auto">
        <div className="w-7/16">
          <h2 className="text-amber-500 text-3xl font-bold uppercase tracking-tight mt-5">Bodob Skobis TCG Card Editor</h2>
          <Link 
            type="button" 
            className='inline-flex items-center px-4 py-2 border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200 mt-5 mb-10'
            href={{pathname:'./tcg/supporter'}}
          >
            Switch to supporter card
          </Link>
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Card Name</label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Category</label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="rarity" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Rarity</label>
              <select
                id="rarity"
                value={rarity}
                onChange={(e) => setRarity(e.target.value as RarityType)}
                className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
                <option value="Exquisite">Exquisite</option>
              </select>
            </div>

            <div>
              <label htmlFor="energyType" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Energy Type</label>
              <select
                id="energyType"
                value={energyType}
                onChange={(e) => setEnergyType(e.target.value as EnergyType)}
                className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="Splat">Splat</option>
                <option value="Rage">Rage</option>
                <option value="Whimsy">Whimsy</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Terra">Terra</option>
              </select>
            </div>

            {/* Div for Attack and Defence inputs */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="attack" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Attack</label>
                    <input
                        id="attack"
                        type="number"
                        value={attack}
                        onChange={(e) => setAttack(parseInt(e.target.value))}
                        step="1"
                        min="1"
                        className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="defence" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Defence</label>
                    <input
                        id="defence"
                        type="number"
                        value={defence}
                        onChange={(e) => setDefence(parseInt(e.target.value, 10))}
                        min="0"
                        className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Div for title and ability inputs */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Title</label>
                    <input
                      id="title"
                      value={title}
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="ability" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Ability</label>
                    <input
                      id="ability"
                      value={ability}
                      type="text"
                      onChange={(e) => setAbility(e.target.value)}
                      className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Div for energy cost */}
            <div className="flex gap-4">
              <div>
                <label htmlFor="energyCostA" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Energy Cost 1</label>
                <select
                  id="energyCostA"
                  value={energyCostA}
                  onChange={(e) => setEnergyCostA(e.target.value as EnergyCostType)}
                  className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                >
                  <option value="None">None</option>
                  <option value="Splat">Splat</option>
                  <option value="Rage">Rage</option>
                  <option value="Whimsy">Whimsy</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Terra">Terra</option>
                  <option value="SplatFinal">Splat w/Number</option>
                </select>
              </div>
              <div>
                <label htmlFor="energyCostB" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Energy Cost 2</label>
                <select
                  id="energyCostB"
                  value={energyCostB}
                  onChange={(e) => setEnergyCostB(e.target.value as EnergyCostType)}
                  className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                >
                  <option value="None">None</option>
                  <option value="Splat">Splat</option>
                  <option value="Rage">Rage</option>
                  <option value="Whimsy">Whimsy</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Terra">Terra</option>
                  <option value="SplatFinal">Splat w/Number</option>
                </select>
              </div>
              <div>
                <label htmlFor="energyCostC" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Energy Cost 3</label>
                <select
                  id="energyCostC"
                  value={energyCostC}
                  onChange={(e) => setEnergyCostC(e.target.value as EnergyCostType)}
                  className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                >
                  <option value="None">None</option>
                  <option value="Splat">Splat</option>
                  <option value="Rage">Rage</option>
                  <option value="Whimsy">Whimsy</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Terra">Terra</option>
                  <option value="SplatFinal">Splat w/Number</option>
                </select>
              </div>
              <div>
                <label htmlFor="energyCostD" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Energy Cost 4</label>
                <select
                  id="energyCostD"
                  value={energyCostD}
                  onChange={(e) => setEnergyCostD(e.target.value as EnergyCostType)}
                  className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                >
                  <option value="None">None</option>
                  <option value="Splat">Splat</option>
                  <option value="Rage">Rage</option>
                  <option value="Whimsy">Whimsy</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Terra">Terra</option>
                  <option value="SplatFinal">Splat w/Number</option>
                </select>
              </div>
              <div>
                <label htmlFor="energyCostE" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Energy Cost 5</label>
                <select
                  id="energyCostE"
                  value={energyCostE}
                  onChange={(e) => setEnergyCostE(e.target.value as EnergyCostType)}
                  className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                >
                  <option value="None">None</option>
                  <option value="Splat">Splat</option>
                  <option value="Rage">Rage</option>
                  <option value="Whimsy">Whimsy</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Terra">Terra</option>
                  <option value="SplatFinal">Splat w/Number</option>
                </select>
              </div>
            </div>            

            {/* Div for Linebreak copy and energy cost num*/}
            <div className="flex gap-4">
              <div className="flex-1">
                  <label htmlFor="energyCostNum" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Energy Cost Number</label>
                  <input
                      id="energyCostNum"
                      type="number"
                      value={energyCostNum}
                      onChange={(e) => setEnergyCostNum(parseInt(e.target.value))}
                      step="1"
                      min="0"
                      className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors"
                  />
              </div>

              <div className="flex-1">
                  <label htmlFor="Linebreak" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Copy Linebreak</label>
                  <button
                      type="button"
                      className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-amber-500 p-2 rounded-md font-[skobisFont] hover:bg-zinc-700 hover:border-amber-500 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(linebreak)
                        .then(() => {
                            console.log('Linebreak copied to clipboard!');
                            // add a notification here
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
            
            {/* Checkboxes for Skobian, Little Guy, Darkner */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  id="skobian-checkbox"
                  type="checkbox"
                  checked={skobian}
                  onChange={(e) => setSkobian(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 bg-zinc-800 border-zinc-700 rounded"
                />
                <label htmlFor="skobian-checkbox" className="text-sm font-medium text-gray-300">
                  Is Skobian?
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="littleguy-checkbox"
                  type="checkbox"
                  checked={littleguy}
                  onChange={(e) => setLittleguy(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 bg-zinc-800 border-zinc-700 rounded"
                />
                <label htmlFor="littleguy-checkbox" className="text-sm font-medium text-gray-300">
                  Is Little Guy?
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="darkner-checkbox"
                  type="checkbox"
                  checked={darkner}
                  onChange={(e) => setDarkner(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 bg-zinc-800 border-zinc-700 rounded"
                />
                <label htmlFor="darkner-checkbox" className="text-sm font-medium text-gray-300">
                  Is Darkner?
                </label>
              </div>
            </div>

            {/* Description input */}
            <div>
              <div className="flex gap-2 items-center">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 uppercase tracking-wider">Description</label>
                <IoMdInformationCircleOutline data-tooltip-id="desc-tooltop" className="text-amber-500 cursor-help"/>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors min-h-[200px]"
              />
            </div>

            {/* Flavor Text input */}
            <div>
              <div className="flex gap-2 items-center">
                <label htmlFor="flavourText" className="block text-sm font-medium text-gray-300 uppercase tracking-wider">Flavour Text</label>
              </div>
              <textarea
                id="flavourText"
                value={flavourText}
                onChange={(e) => setFlavourText(e.target.value)}
                className="mt-1 block w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded-md font-[skobisFont] focus:border-amber-500 focus:outline-none transition-colors min-h-[120px]"
              />
            </div>

            <div>
              <label htmlFor="cardImage" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Card Image</label>
              <input
                id="cardImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-amber-500 file:text-zinc-900 file:font-semibold file:uppercase file:tracking-wider hover:file:bg-amber-400 file:cursor-pointer file:transition-colors"
              />
            </div>


            {/* Zoom and pan inputs */}
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <label className="block whitespace-nowrap min-w-[120px] text-gray-300 text-sm">Zoom: {imageZoom.toFixed(2)}</label>
                    <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={imageZoom}
                        onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                        className="w-64 accent-amber-500"
                    />
                    <button
                        type="button"
                        onClick={resetZoom}
                        className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-gray-300 rounded transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <label className="block whitespace-nowrap min-w-[120px] text-gray-300 text-sm">Pan X: {imageX}px</label>
                    <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={imageX}
                        onChange={(e) => setImageX(parseInt(e.target.value))}
                        className="w-64 accent-amber-500"
                    />
                    <button
                        type="button"
                        onClick={resetX}
                        className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-gray-300 rounded transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <label className="block whitespace-nowrap min-w-[120px] text-gray-300 text-sm">Pan Y: {imageY}px</label>
                    <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={imageY}
                        onChange={(e) => setImageY(parseInt(e.target.value))}
                        className="w-64 accent-amber-500"
                    />
                    <button
                        type="button"
                        onClick={resetY}
                        className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-gray-300 rounded transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </div>
          </form>
          <button
            type="button"
            onClick={handleDownload}
            className="mt-6 inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold uppercase tracking-wider transition-colors duration-200"
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
              attack={attack}
              defence={defence}
              imageZoom={imageZoom}
              imageX={imageX}
              imageY={imageY}
              skobian={skobian}
              littleguy={littleguy}
              darkner={darkner}
              title={title}
              ability={ability}
              flavourText={flavourText}
              energyCostA={energyCostA}
              energyCostB={energyCostB}
              energyCostC={energyCostC}
              energyCostD={energyCostD}
              energyCostE={energyCostE}
              energyCostNum={energyCostNum}
            />
          </div>
        </div>
      </div>
      <ReactTooltip id="desc-tooltop" place="right" className="!bg-zinc-800 !text-gray-300">
        <p className='max-w-sm'>
          By surrounding the name of an energy type with * * you can add icons to the description box.
        </p>
        <p className='max-w-sm mt-2'>
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
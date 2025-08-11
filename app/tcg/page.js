"use client"
import { useState, useRef } from 'react';
import ClientNavbar from '../../components/clientNavbar';
import TradingCard from '../../components/TradingCard';
import html2canvas from 'html2canvas';

export default function Tcg() {
  const [cardName, setCardName] = useState('Name');
  const [description, setDescription] = useState('*splat* *splat* - Deal XX damage and discard  1 *splat* energy');
  const [energyType, setEnergyType] = useState('Splat');
  const [rarity, setRarity] = useState('Common');
  const [category, setCategory] = useState('Skobian');
  const [hp, setHP] = useState(100);
  const [retreat, setRetreat] = useState(2);
  const [cardImage, setCardImage] = useState(null);

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
        <div className="w-1/2">
          <h2 className="text-xl font-bold mb-4">Edit Your Card</h2>
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium">Card Name</label>
              <input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium">Category</label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="rarity" className="block text-sm font-medium">Rarity</label>
              <select
                id="rarity"
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
              >
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
              </select>
            </div>

            <div>
              <label htmlFor="energyType" className="block text-sm font-medium">Energy Type</label>
              <select
                id="energyType"
                value={energyType}
                onChange={(e) => setEnergyType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
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
                    <label htmlFor="hp" className="block text-sm font-medium">HP</label>
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
                        className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="retreat" className="block text-sm font-medium">Retreat Cost</label>
                    <input
                        id="retreat"
                        type="number"
                        value={retreat}
                        onChange={(e) => setRetreat(parseInt(e.target.value, 10))}
                        min="0"
                        className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="cardImage" className="block text-sm font-medium">Card Image</label>
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
                    <label className="block whitespace-nowrap min-w-[120px]">Zoom: {imageZoom.toFixed(2)}</label>
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
                    <label className="block whitespace-nowrap min-w-[120px]">Pan X: {imageX}px</label>
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
                    <label className="block whitespace-nowrap min-w-[120px]">Pan Y: {imageY}px</label>
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
            />
          </div>
        </div>
      </div>
    </main>
  );
}
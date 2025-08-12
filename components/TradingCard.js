"use client"
import React from 'react';
//import Image from 'next/image';

export default function TradingCard({ name, description, energy, cardImage, rarity, category, hp, retreat, imageX, imageY, imageZoom, skobian }) {

    // Array of energy icon pngs
    const energyImageMap = {
        'Splat': '/images/tcg/energy/border/splat_energy_border.png',
        'Rage': '/images/tcg/energy/border/rage_energy_border.png',
        'Whimsy': '/images/tcg/energy/border/whimsy_energy_border.png',
        'Mechanical': '/images/tcg/energy/border/mechanical_energy_border.png',
        'Terra': '/images/tcg/energy/border/terra_energy_border.png',
    };
    // Get the image source based on the energy prop
    const energySrc = energyImageMap[energy];

    // Array of energy text icons
    const keywordIconMap = {
        '*splat*': '/images/tcg/energy/border/splat_energy_border.png',
        '*rage*': '/images/tcg/energy/border/rage_energy_border.png',
        '*whimsy*': '/images/tcg/energy/border/whimsy_energy_border.png',
        '*mechanical*': '/images/tcg/energy/border/mechanical_energy_border.png',
        '*terra*': '/images/tcg/energy/border/terra_energy_border.png',
    };

    // Array of coloured card templates
    const templateMap = {
        'Splat': '/images/tcg/tcg_template_1.png',
        'Rage': '/images/tcg/tcg_template_rage.png',
        'Whimsy': '/images/tcg/tcg_template_whimsy.png',
        'Mechanical': '/images/tcg/tcg_template_mechanical.png',
        'Terra': '/images/tcg/tcg_template_terra.png',
    };
    // Get the card template based on the energy prop
    const templateSrc = templateMap[energy];

    // Array of rarity card colours
    const rarityMap = {
        'Common': '/images/tcg/rarity/common_bar.png',
        'Rare': '/images/tcg/rarity/rare_bar.png',
        'Epic': '/images/tcg/rarity/epic_bar.png',
        'Legendary': '/images/tcg/rarity/legendary_bar.png',
    };
    // Get the card template based on the energy prop
    const raritySrc = rarityMap[rarity];

    // Array of rarity critter strings
    const rarityStringMap = {
        'Common': 'Common Critter',
        'Rare': 'Rare Critter',
        'Epic': 'Epic Critter',
        'Legendary': 'Legendary Critter',
    };
    const rarityString = rarityStringMap[rarity];

    const parseDescription = (text) => {
        if (!text) return null;

        // Split the text by both the energy keywords and newlines
        const escapedKeywords = Object.keys(keywordIconMap)
            .map(key => key.replace(/\*/g, '\\*'))
            .join('|');
        
        // Use a regex that captures both keywords and newline characters
        const regex = new RegExp(`(${escapedKeywords}|\\n)`, 'g');
        const parts = text.split(regex);

        return parts.map((part, index) => {
            // Check if the part is a newline character
            if (part === '\n') {
            return <br key={index} />;
            }

            // Check if the part is an energy icon keyword
            const iconSrc = keywordIconMap[part];
            if (iconSrc) {
            return (
                <img
                key={index}
                src={iconSrc}
                alt={part.replace(/\*/g, '')}
                style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' }}
                />
            );
            }
            
            // Otherwise, return the text part as a span
            return <span key={index}>{part}</span>;
        });
    };


    const nameStyle = { // Style for the name label
        position: 'absolute',
        top: '39px',
        left: '40px',
        width: '200px',
        textAlign: 'left',
        fontSize: '20px',
        color: 'white',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const categoryStyle = { // Style for the category and rarity label
        position: 'absolute',
        top: '246px',
        left: '30px',
        width: '260px',
        textAlign: 'left',
        fontSize: '20px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const imageContainerStyle = { // Style for framed image
        position: 'absolute',
        top: '65px',
        left: '32px',
        width: '260px',
        height: '180px',
        overflow: 'hidden',
        zIndex: 1
    };

    const descriptionStyle = { // Style for description/attacks
        position: 'absolute',
        top: '330px',
        left: '25px',
        width: '270px',
        height: '140px',
        overflowY: 'auto',
        fontSize: '16px',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const energyStyle = { // Style for the energy icon
        position: 'absolute',
        top: '22.5px', // Adjust this value
        right: '13.5px', // Adjust this value
        width: '60px', // Set a fixed width for the image
        height: '60px', // Set a fixed height for the image
        zIndex: 4
    };

    const hpStyle = { // Style for the hp number
        position: 'absolute',
        top: '278px',
        left: '60px',
        width: '400px',
        textAlign: 'left',
        fontSize: '30px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const retreatStyle = { // Style for the retreat cost number
        position: 'absolute',
        top: '285px',
        left: '225px',
        width: '400px',
        textAlign: 'left',
        fontSize: '22px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const retreatIconStyle = { // Style for the retreat icon
        position: 'absolute',
        top: '288px', // Adjust this value
        right: '50px', // Adjust this value
        width: '20px', // Set a fixed width for the image
        height: '20px', // Set a fixed height for the image
        zIndex: 4
    };

    const hpLabelStyle = { // Style for the hp label
        position: 'absolute',
        top: '282px',
        left: '25px',
        width: '400px',
        textAlign: 'left',
        fontSize: '12px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const retreatLabelStyle = { // Style for the retreat label
        position: 'absolute',
        top: '282px',
        left: '150px',
        width: '400px',
        textAlign: 'left',
        fontSize: '12px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    return (
        <div className="relative w-[320px] h-[480px]"> {/* 2:3 Ratio for cards */}

            {cardImage && (
                    <img
                        src={cardImage}
                        alt={name}
                        style={{
                            imageContainerStyle,
                            transform: `scale(${imageZoom}) translate(${imageX}px, ${imageY}px)`,
                            transformOrigin: '50% 50%',
                        }}
                    />
            )}


            {/* Background PNG template */}
            <img
                src={templateSrc}
                alt="Trading Card Template"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 2
                }}
            />

            {/* Rarity Bar PNG template */}
            <img
                src={raritySrc}
                alt="Trading Card Rarity Bar"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 3
                }}
            />



            {/* --- Absolutely positioned card elements --- */}

            {skobian && (
            <img
                src={"images/tcg/skobian.png"}
                alt="Skobian Tag"
                style={{
                position: 'absolute',
                top: '190px',
                left: '194px',
                width: '100px',
                zIndex: 3
                }}
            />
            )}

            <div style={nameStyle}>{name}</div>

            {/* 2. Conditionally render the energy image */}
            {energySrc && (
                <div style={energyStyle}>
                    <img
                        src={energySrc}
                        alt={`${energy} Energy`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>
            )}

            <div style={categoryStyle}>
                {rarityString} {category && '-'} {category}
            </div>

            <div style={hpLabelStyle}>HP</div>
            <div style={hpStyle}>{hp}</div>

            <div style={retreatLabelStyle}>Retreat Cost</div>
            <div style={retreatStyle}>{retreat}x</div>
            <div style={retreatIconStyle}>
                <img
                    src={'/images/tcg/energy/border/splat_energy_border.png'}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>


            <div style={descriptionStyle}>{parseDescription(description)}</div>
        </div>
    );
}
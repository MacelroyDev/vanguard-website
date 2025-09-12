"use client"
import React from 'react';
//import Image from 'next/image';

export default function SupporterCard({ name, description, energy, cardImage, rarity, category, hp, retreat, imageX, imageY, imageZoom, skobian }) {

    // Array of tool icons
    const toolIconMap = {
        'Supporter': '/images/tcg/supporter_icon.png',
        'Gizmo': '/images/tcg/gizmo_icon.png',
        'Thingamajig': '/images/tcg/thing_icon.png',
        'Erection': '/images/tcg/erection_icon.png',
    };

    const energySrc = toolIconMap[category];

    // Array of energy text icons
    const keywordIconMap = {
        '*splat*': '/images/tcg/energy/border/splat_energy_border.png',
        '*rage*': '/images/tcg/energy/border/rage_energy_border.png',
        '*whimsy*': '/images/tcg/energy/border/whimsy_energy_border.png',
        '*mechanical*': '/images/tcg/energy/border/mechanical_energy_border.png',
        '*terra*': '/images/tcg/energy/border/terra_energy_border.png',
        '*none*': '/images/tcg/energy/border/no_energy_border.png',
        '*v*': '/images/tcg/vanguard-badge.png',
    };

    // Get the card template based on the energy prop
    const templateSrc = '/images/tcg/tcg_supporter_template.png'

    // Array of rarity card colours
    const rarityMap = {
        'Common': '/images/tcg/rarity/common_bar.png',
        'Rare': '/images/tcg/rarity/rare_bar.png',
        'Epic': '/images/tcg/rarity/epic_bar.png',
        'Legendary': '/images/tcg/rarity/legendary_bar.png',
        'Exquisite': '/images/tcg/rarity/ex_bar.png',
    };
    // Get the card template based on the energy prop
    const raritySrc = rarityMap[rarity];

    const ruleArray = {
        'Supporter': 'You can only play 1 Supporter card per turn.',
        'Gizmo': 'You can play multiple Gizmo cards per turn.',
        'Thingamajig': 'You can only attach 1 Thingamajig card per Critter unless otherwise stated.',
        'Erection': 'You can only play 1 Erection card per turn.',
    }
    const ruleSrc = ruleArray[category];

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
            let iconSize = '14px';

            if (iconSrc == '/images/tcg/vanguard-badge.png'){
                iconSize = '24px';
            }
            if (iconSrc) {
            return (
                <img
                key={index}
                src={iconSrc}
                alt={part.replace(/\*/g, '')}
                style={{ width: iconSize, height: iconSize, display: 'inline-block', verticalAlign: 'middle' }}
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
        fontSize: '12px',
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

    const ruleLabelStyle = { // Style for the hp label
        position: 'absolute',
        top: '282px',
        left: '25px',
        width: '110px',
        textAlign: 'left',
        fontSize: '8px',
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


            <div style={nameStyle}>{parseDescription(name)}</div>

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
                {rarity} {category}
            </div>

            <div style={ruleLabelStyle}>
                {ruleSrc}
            </div>


            <div style={descriptionStyle}>{parseDescription(description)}</div>
        </div>
    );
}
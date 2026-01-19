"use client"
import React, { CSSProperties, ReactNode } from 'react';
//import Image from 'next/image';

export interface TradingCardProps {
    name: string;
    description: string;
    energy: 'Splat' | 'Rage' | 'Whimsy' | 'Mechanical' | 'Terra';
    cardImage: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Exquisite';
    category?: string;
    hp: number;
    retreat: number;
    imageX: number;
    imageY: number;
    imageZoom: number;
    skobian?: boolean;
    littleguy?: boolean;
    darkner?: boolean;
    level: number;
}


export default function TradingCard({
    name,
    description,
    energy,
    cardImage,
    rarity,
    category,
    hp,
    retreat,
    imageX,
    imageY,
    imageZoom,
    skobian,
    littleguy,
    darkner,
    level,
}: TradingCardProps) {

    type EnergyType = TradingCardProps['energy'];
    type RarityType = TradingCardProps['rarity'];

    // Array of energy icon pngs
    const energyImageMap: Record<EnergyType, string> = {
        'Splat': '/images/tcg/energy/border/splat_energy_border.png',
        'Rage': '/images/tcg/energy/border/rage_energy_border.png',
        'Whimsy': '/images/tcg/energy/border/whimsy_energy_border.png',
        'Mechanical': '/images/tcg/energy/border/mechanical_energy_border.png',
        'Terra': '/images/tcg/energy/border/terra_energy_border.png',
    };
    // Get the image source based on the energy prop
    const energySrc = energyImageMap[energy];

    // Array of energy text icons
    const keywordIconMap: Record<string, string> = {
        '*splat*': '/images/tcg/energy/border/splat_energy_border.png',
        '*rage*': '/images/tcg/energy/border/rage_energy_border.png',
        '*whimsy*': '/images/tcg/energy/border/whimsy_energy_border.png',
        '*mechanical*': '/images/tcg/energy/border/mechanical_energy_border.png',
        '*terra*': '/images/tcg/energy/border/terra_energy_border.png',
        '*none*': '/images/tcg/energy/border/no_energy_border.png',
        '*v*': '/images/tcg/vanguard-badge.png',
        '*ability*': '/images/tcg/ability.png',
    };

    // Array of coloured card templates
    const templateMap: Record<EnergyType, string> = {
        'Splat': '/images/tcg/v2-templates/template_splat.png',
        'Rage': '/images/tcg/v2-templates/template_rage.png',
        'Whimsy': '/images/tcg/v2-templates/template_whimsy.png',
        'Mechanical': '/images/tcg/v2-templates/template_mechanical.png',
        'Terra': '/images/tcg/v2-templates/template_terra.png',
    };
    // Get the card template based on the energy prop
    const templateSrc = templateMap[energy];

    // Array of rarity card colours
    const rarityMap: Record<RarityType, string> = {
        'Common': '/images/tcg/rarity/CardC.png',
        'Rare': '/images/tcg/rarity/CardR.png',
        'Epic': '/images/tcg/rarity/CardE.png',
        'Legendary': '/images/tcg/rarity/CardL.png',
        'Exquisite': '/images/tcg/rarity/CardEx.png',
    };
    // Get the card template based on the energy prop
    const raritySrc = rarityMap[rarity];

    // Array of rarity critter strings
    const rarityStringMap: Record<RarityType, string> = {
        'Common': 'Common Critter',
        'Rare': 'Rare Critter',
        'Epic': 'Epic Critter',
        'Legendary': 'Legendary Critter',
        'Exquisite': 'Exquisite Critter',
    };
    const rarityString = rarityStringMap[rarity];

    const parseDescription = (text: string): ReactNode[] | null => {
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

            if (iconSrc === '/images/tcg/vanguard-badge.png'){
                iconSize = '24px';
            }

            if (iconSrc === '/images/tcg/ability.png'){
                //iconSize = '24px';
                const iconWidth = `${parseInt(iconSize) * 4}px`;
                return (
                <img
                key={index}
                src={iconSrc}
                alt={part.replace(/\*/g, '')}
                style={{ width: iconWidth, height: iconSize, display: 'inline-block', verticalAlign: 'middle' }}
                />
            );
            }else if (iconSrc) {
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


    const nameStyle: CSSProperties = { // Style for the name label
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

    const levelStyle: CSSProperties = { // Style for the level label
        position: 'absolute',
        top: '20px',
        left: '30px',
        width: '200px',
        textAlign: 'left',
        fontSize: '14px',
        color: 'white',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const categoryStyle: CSSProperties = { // Style for the category and rarity label
        position: 'absolute',
        top: '248px',
        left: '30px',
        width: '260px',
        textAlign: 'left',
        fontSize: '20px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const imageContainerStyle: CSSProperties = { // Style for framed image
        position: 'absolute',
        top: '65px',
        left: '32px',
        width: '260px',
        height: '180px',
        overflow: 'hidden',
        zIndex: 1
    };

    const descriptionStyle: CSSProperties = { // Style for description/attacks
        position: 'absolute',
        top: '330px',
        left: '25px',
        width: '270px',
        height: '140px',
        overflowY: 'auto',
        fontSize: '12px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const energyStyle: CSSProperties = { // Style for the energy icon
        position: 'absolute',
        top: '22.5px', // Adjust this value
        right: '13.5px', // Adjust this value
        width: '60px', // Set a fixed width for the image
        height: '60px', // Set a fixed height for the image
        zIndex: 4
    };

    const hpStyle: CSSProperties = { // Style for the hp number
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

    const retreatStyle: CSSProperties = { // Style for the retreat cost number
        position: 'absolute',
        top: '285px',
        left: '215px',
        width: '400px',
        textAlign: 'left',
        fontSize: '22px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const retreatIconStyle: CSSProperties = { // Style for the retreat icon
        position: 'absolute',
        top: '288px', // Adjust this value
        right: '60px', // Adjust this value
        width: '20px', // Set a fixed width for the image
        height: '20px', // Set a fixed height for the image
        zIndex: 4
    };

    const hpLabelStyle: CSSProperties = { // Style for the hp label
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

    const retreatLabelStyle: CSSProperties = { // Style for the retreat label
        position: 'absolute',
        top: '282px',
        left: '150px',
        width: '400px',
        textAlign: 'left',
        fontSize: '11.5px',
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
                            ...imageContainerStyle,
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
                src={"/images/tcg/skobian.png"}
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

            {littleguy && (
            <img
                src={"/images/tcg/little-guy.png"}
                alt="Little Guy Tag"
                style={{
                position: 'absolute',
                top: '190px',
                left: '194px',
                width: '100px',
                zIndex: 3
                }}
            />
            )}

            {darkner && (
            <img
                src={"/images/tcg/darkner.png"}
                alt="Little Guy Tag"
                style={{
                position: 'absolute',
                top: '190px',
                left: '194px',
                width: '100px',
                zIndex: 3
                }}
            />
            )}

            <div style={nameStyle}>{parseDescription(name)}</div>

            <div style={levelStyle}>{`Level ${level}`}</div>

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
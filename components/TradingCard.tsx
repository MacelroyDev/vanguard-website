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
    attack: number;
    defence: number;
    imageX: number;
    imageY: number;
    imageZoom: number;
    skobian?: boolean;
    littleguy?: boolean;
    darkner?: boolean;
    title: string;
    ability: string;
    flavourText: string;
}


export default function TradingCard({
    name,
    description,
    energy,
    cardImage,
    rarity,
    category,
    attack,
    defence,
    imageX,
    imageY,
    imageZoom,
    skobian,
    littleguy,
    darkner,
    title,
    ability,
    flavourText
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
        top: '20px',
        left: '40px',
        width: '200px',
        textAlign: 'left',
        fontSize: '20px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const titleStyle: CSSProperties = { // Style for the title label
        position: 'absolute',
        top: '25px',
        left: '30px',
        width: '200px',
        textAlign: 'right',
        fontSize: '14px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const categoryStyle: CSSProperties = { // Style for the category and rarity label
        position: 'absolute',
        top: '255px',
        left: '115px',
        width: '200px',
        textAlign: 'left',
        fontSize: '16px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const abilityStyle: CSSProperties = { // Style for the ability label
        position: 'absolute',
        top: '226px',
        right: '50px',
        width: '200px',
        textAlign: 'right',
        fontSize: '12px',
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
        top: '300px',
        left: '25px',
        width: '270px',
        height: '140px',
        overflowY: 'auto',
        fontSize: '12px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const flavourStyle: CSSProperties = { // Style for flavour text
        position: 'absolute',
        top: '445px',
        left: '88px',
        width: '140px',
        height: '30px',
        overflowY: 'clip',
        fontSize: '6px',
        textAlign: 'center',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const energyStyle: CSSProperties = { // Style for the energy icon
        position: 'absolute',
        top: '10px', // Adjust this value
        right: '11px', // Adjust this value
        width: '68px', // Set a fixed width for the image
        height: '68px', // Set a fixed height for the image
        zIndex: 4
    };

    const attackStyle: CSSProperties = { // Style for the attack number
        position: 'absolute',
        top: '222px',
        left: '28px',
        width: '400px',
        textAlign: 'left',
        fontSize: '30px',
        color: 'black',
        fontFamily: 'skobisFont',
        zIndex: 4
    };

    const defenceStyle: CSSProperties = { // Style for the defence number
        position: 'absolute',
        top: '232px',
        left: '78px',
        width: '400px',
        textAlign: 'left',
        fontSize: '30px',
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

            <div style={titleStyle}>{title}</div>

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

            <div style={abilityStyle}>{ability}</div>

            <div style={attackStyle}>{attack}</div>

            <div style={defenceStyle}>{defence}</div>


            <div style={descriptionStyle}>{parseDescription(description)}</div>
            <div style={flavourStyle}>{parseDescription(flavourText)}</div>
        </div>
    );
}
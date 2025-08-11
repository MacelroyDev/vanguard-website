import React from 'react';
import Image from 'next/image';

export default function TradingCard({ name, description, energy, cardImage, category, hp, retreat }) {

    // Array of energy icon pngs
    const energyImageMap = {
        'Splat': '/images/tcg/energy/splat_energy.png',
        'Rage': '/images/tcg/energy/rage_energy.png',
        'Whimsy': '/images/tcg/energy/whimsy_energy.png',
        'Mechanical': '/images/tcg/energy/mechanical_energy.png',
        'Terra': '/images/tcg/energy/terra_energy.png',
    };
    // Get the image source based on the energy prop
    const energySrc = energyImageMap[energy];

    const keywordIconMap = {
        '\\*splat\\*': '/images/tcg/energy/splat_energy.png',
        '\\*rage\\*': '/images/tcg/energy/rage_energy.png',
        '\\*whimsy\\*': '/images/tcg/energy/whimsy_energy.png',
        '\\*mechanical\\*': '/images/tcg/energy/mechanical_energy.png',
        '\\*terra\\*': '/images/tcg/energy/terra_energy.png',
    };

        const parseDescription = (text) => {
        if (!text) return null;

        // Create a regex to find all keywords
        const keywords = Object.keys(keywordIconMap).join('|');
        const regex = new RegExp(`(${keywords})`, 'g');

        const parts = text.split(regex);

        return parts.map((part, index) => {
            const unescapedPart = part.replace(/\\\*/g, '*');
            const iconSrc = keywordIconMap[part];
            if (iconSrc) {
                return (
                    <Image
                        key={index}
                        src={iconSrc}
                        alt={part.replace(/\*/g, '')}
                        width={20}
                        height={20}
                        className="inline-block mx-1 align-middle"
                    />
                );
            }
            return <span key={index}>{part}</span>;
        });
    };


    const nameStyle = { // Style for the name label
        position: 'absolute',
        top: '39px',
        left: '40px',
        width: '400px',
        textAlign: 'left',
        fontSize: '20px',
        color: 'white',
        fontFamily: 'skobisFont'
    };

    const categoryStyle = { // Style for the category and rarity label
        position: 'absolute',
        top: '246px',
        left: '30px',
        width: '400px',
        textAlign: 'left',
        fontSize: '20px',
        color: 'black',
        fontFamily: 'skobisFont'
    };

    const imageContainerStyle = {
        position: 'absolute',
        top: '70px', // Adjust this value
        left: '40px', // Adjust this value
        width: '240px', // Adjust this value
        height: '160px', // Adjust this value
        overflow: 'hidden',
    };

    const descriptionStyle = {
        position: 'absolute',
        bottom: '90px', // Adjust this value
        left: '30px', // Adjust this value
        width: '240px', // Adjust this value
        height: '60px', // Adjust this value
        overflowY: 'auto',
        fontSize: '16px',
        fontFamily: 'skobisFont'
    };

    const energyStyle = { // Style for the energy icon
        position: 'absolute',
        top: '31px', // Adjust this value
        right: '23px', // Adjust this value
        width: '40px', // Set a fixed width for the image
        height: '40px', // Set a fixed height for the image
    };

    const hpStyle = { // Style for the hp number
        position: 'absolute',
        top: '285px',
        left: '45px',
        width: '400px',
        textAlign: 'left',
        fontSize: '22px',
        color: 'black',
        fontFamily: 'skobisFont'
    };

    const retreatStyle = { // Style for the retreat cost number
        position: 'absolute',
        top: '285px',
        left: '155px',
        width: '400px',
        textAlign: 'left',
        fontSize: '22px',
        color: 'black',
        fontFamily: 'skobisFont'
    };

    const retreatIconStyle = { // Style for the retreat icon
        position: 'absolute',
        top: '287px', // Adjust this value
        right: '118px', // Adjust this value
        width: '22px', // Set a fixed width for the image
        height: '22px', // Set a fixed height for the image
    };

    const hpLabelStyle = { // Style for the hp label
        position: 'absolute',
        top: '282px',
        left: '25px',
        width: '400px',
        textAlign: 'left',
        fontSize: '12px',
        color: 'black',
        fontFamily: 'skobisFont'
    };

    const retreatLabelStyle = { // Style for the retreat label
        position: 'absolute',
        top: '282px',
        left: '205px',
        width: '400px',
        textAlign: 'left',
        fontSize: '12px',
        color: 'black',
        fontFamily: 'skobisFont'
    };

    return (
        <div className="relative w-[320px] h-[480px]"> {/* 2:3 Ratio for cards */}
            {/* Background PNG template */}
            <Image
                src="/images/tcg/tcg_template_1.png"
                alt="Trading Card Template"
                layout="fill"
                objectFit="cover"
                priority // Add if the image is above the fold
            />

            {/* --- Absolutely positioned card elements --- */}

            <div style={nameStyle}>{name}</div>

            {/* 2. Conditionally render the energy image */}
            {energySrc && (
                <div style={energyStyle}>
                    <Image
                        src={energySrc}
                        alt={`${energy} Energy`}
                        layout="fill"
                        objectFit="contain" // Use contain to fit image within the div
                    />
                </div>
            )}
            
            <div style={imageContainerStyle}>
                {cardImage && (
                <Image
                    src={cardImage}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                />
                )}
            </div>

            <div style={categoryStyle}>{category}</div>

            <div style={hpLabelStyle}>HP</div>
            <div style={hpStyle}>{hp}</div>

            <div style={retreatLabelStyle}>Retreat Cost</div>
            <div style={retreatStyle}>{retreat}x</div>
            <div style={retreatIconStyle}>
                <Image
                    src={'/images/tcg/retreat_splat.png'}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>


            <div style={descriptionStyle}>{parseDescription(description)}</div>
        </div>
    );
}
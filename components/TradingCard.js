import React from 'react';
import Image from 'next/image';

export default function TradingCard({ name, description, energy, cardImage, category, hp, retreat }) {

    const nameStyle = { // Style for the name label
        position: 'absolute',
        top: '39px',
        left: '40px',
        width: '400px',
        textAlign: 'left',
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'white',
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
        bottom: '40px', // Adjust this value
        left: '40px', // Adjust this value
        width: '240px', // Adjust this value
        height: '60px', // Adjust this value
        overflowY: 'auto',
        fontSize: '14px',
    };

    const energyStyle = {
        position: 'absolute',
        top: '30px', // Adjust this value
        right: '50px', // Adjust this value
        fontSize: '18px',
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

            <div style={energyStyle}>{energy}</div>
            
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

            <div style={descriptionStyle}>{description}</div>
        </div>
    );
}
"use client"
import React, { CSSProperties, ReactNode } from 'react';

export interface SupporterCardProps {
    name: string;
    description: string;
    supportType: 'Gizmo' | 'Thingamajig' | 'Erections' | 'Bits';
    cardImage: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Exquisite';
    category?: string;
    imageX: number;
    imageY: number;
    imageZoom: number;
    skobian?: boolean;
    littleguy?: boolean;
    darkner?: boolean;
    title: string;
    ability: string;
    flavourText: string;
    energyCostA: 'None' | 'Splat' | 'Rage' | 'Whimsy' | 'Mechanical' | 'Terra' | 'SplatFinal';
    energyCostB: 'None' | 'Splat' | 'Rage' | 'Whimsy' | 'Mechanical' | 'Terra' | 'SplatFinal';
    energyCostC: 'None' | 'Splat' | 'Rage' | 'Whimsy' | 'Mechanical' | 'Terra' | 'SplatFinal';
    energyCostD: 'None' | 'Splat' | 'Rage' | 'Whimsy' | 'Mechanical' | 'Terra' | 'SplatFinal';
    energyCostE: 'None' | 'Splat' | 'Rage' | 'Whimsy' | 'Mechanical' | 'Terra' | 'SplatFinal';
    energyCostNum?: number;
}

export default function SupporterCard({
    name,
    description,
    supportType,
    cardImage,
    rarity,
    category,
    imageX,
    imageY,
    imageZoom,
    skobian,
    littleguy,
    darkner,
    title,
    ability,
    flavourText,
    energyCostA,
    energyCostB,
    energyCostC,
    energyCostD,
    energyCostE,
    energyCostNum
}: SupporterCardProps) {

    type SupportType = SupporterCardProps['supportType'];
    type RarityType = SupporterCardProps['rarity'];
    type EnergyCostType = SupporterCardProps['energyCostA'];

    // Support type icon map (temporarily using energy border icons)
    const supportIconMap: Record<SupportType, string> = {
        'Gizmo':       '/images/tcg/energy/border/splat_energy_border.png',
        'Thingamajig': '/images/tcg/energy/border/rage_energy_border.png',
        'Erections':   '/images/tcg/energy/border/whimsy_energy_border.png',
        'Bits':        '/images/tcg/energy/border/mechanical_energy_border.png',
    };
    const iconSrc = supportIconMap[supportType];

    // Always use the support template regardless of type
    const templateSrc = '/images/tcg/v2-templates/template_support.png';

    const rarityMap: Record<RarityType, string> = {
        'Common':    '/images/tcg/rarity/CardC.png',
        'Rare':      '/images/tcg/rarity/CardR.png',
        'Epic':      '/images/tcg/rarity/CardE.png',
        'Legendary': '/images/tcg/rarity/CardL.png',
        'Exquisite': '/images/tcg/rarity/CardEx.png',
    };
    const raritySrc = rarityMap[rarity];

    const rarityStringMap: Record<RarityType, string> = {
        'Common':    'Common Support',
        'Rare':      'Rare Support',
        'Epic':      'Epic Support',
        'Legendary': 'Legendary Support',
        'Exquisite': 'Exquisite Support',
    };
    const rarityString = rarityStringMap[rarity];

    const energyCostColorMap: Record<EnergyCostType, string> = {
        'None':       'transparent',
        'Splat':      '#6B7280',
        'Rage':       '#DC2626',
        'Whimsy':     '#EC4899',
        'Mechanical': '#e9b26a',
        'Terra':      '#16A34A',
        'SplatFinal': '#6B7280',
    };

    const keywordIconMap: Record<string, string> = {
        '*splat*':      '/images/tcg/energy/border/splat_energy_border.png',
        '*rage*':       '/images/tcg/energy/border/rage_energy_border.png',
        '*whimsy*':     '/images/tcg/energy/border/whimsy_energy_border.png',
        '*mechanical*': '/images/tcg/energy/border/mechanical_energy_border.png',
        '*terra*':      '/images/tcg/energy/border/terra_energy_border.png',
        '*none*':       '/images/tcg/energy/border/no_energy_border.png',
        '*v*':          '/images/tcg/vanguard-badge.png',
        '*ability*':    '/images/tcg/ability.png',
        '*tapped*':     '/images/tcg/tapped_icon.png',
    };

    const parseDescription = (text: string): ReactNode[] | null => {
        if (!text) return null;
        const escapedKeywords = Object.keys(keywordIconMap)
            .map(key => key.replace(/\*/g, '\\*'))
            .join('|');
        const regex = new RegExp(`(${escapedKeywords}|\\n)`, 'g');
        const parts = text.split(regex);

        return parts.map((part, index) => {
            if (part === '\n') return <br key={index} />;
            const src = keywordIconMap[part];
            let iconSize = '14px';
            if (src === '/images/tcg/vanguard-badge.png') iconSize = '24px';
            if (src === '/images/tcg/ability.png') {
                const iconWidth = `${parseInt(iconSize) * 4}px`;
                return <img key={index} src={src} alt={part.replace(/\*/g, '')} style={{ width: iconWidth, height: iconSize, display: 'inline-block', verticalAlign: 'middle' }} />;
            } else if (src) {
                return <img key={index} src={src} alt={part.replace(/\*/g, '')} style={{ width: iconSize, height: iconSize, display: 'inline-block', verticalAlign: 'middle' }} />;
            }
            return <span key={index}>{part}</span>;
        });
    };

    const renderEnergyCostCircle = (cost: EnergyCostType, index: number) => {
        const color = energyCostColorMap[cost];
        return (
            <div key={index} style={energyCostCircleStyle(color)}>
                {cost === 'SplatFinal' && energyCostNum !== undefined ? energyCostNum : ''}
            </div>
        );
    };

    const energyCostCircleStyle = (color: string): CSSProperties => ({
        width: '13px',
        height: '13px',
        borderRadius: '50%',
        backgroundColor: color,
        border: color === 'transparent' ? 'none' : '2px solid rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'skobisFont',
        textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
    });

    const nameStyle: CSSProperties = {
        position: 'absolute', top: '22px', left: '40px',
        width: '200px', textAlign: 'left', fontSize: '20px',
        color: 'black', fontFamily: 'skobisFont', zIndex: 4,
    };
    const titleStyle: CSSProperties = {
        position: 'absolute', top: '28px', left: '30px',
        width: '200px', textAlign: 'right', fontSize: '14px',
        color: 'black', fontFamily: 'skobisFont', zIndex: 4, height: '30px',
    };
    const rarityStyle: CSSProperties = {
        position: 'absolute', top: '250px', left: '40px',
        width: '200px', textAlign: 'left', fontSize: '12px',
        color: 'black', fontFamily: 'skobisFont', zIndex: 4, lineHeight: '18px',
    };
    const categoryStyle: CSSProperties = {
        position: 'absolute', top: '265px', left: '35px',
        width: '200px', textAlign: 'left', fontSize: '18px',
        color: 'black', fontFamily: 'skobisFont', zIndex: 4, lineHeight: '18px',
    };
    const abilityStyle: CSSProperties = {
        position: 'absolute', top: '226px', left: '30px',
        width: '200px', textAlign: 'right', fontSize: '12px',
        color: 'black', fontFamily: 'skobisFont', zIndex: 4,
    };
    const descriptionStyle: CSSProperties = {
        position: 'absolute', top: '300px', left: '25px',
        width: '270px', height: '140px', overflowY: 'auto',
        fontSize: '12px', color: 'black', fontFamily: 'skobisFont', zIndex: 4,
    };
    const flavourStyle: CSSProperties = {
        position: 'absolute', top: '445px', left: '88px',
        width: '140px', height: '30px', overflowY: 'clip',
        fontSize: '6px', textAlign: 'center',
        color: 'black', fontFamily: 'skobisFont', zIndex: 4,
    };
    const iconStyle: CSSProperties = {
        position: 'absolute', top: '10px', right: '11px',
        width: '68px', height: '68px', zIndex: 4,
    };
    const energyCostContainerStyle: CSSProperties = {
        position: 'absolute', top: '79.5px', right: '11.5px',
        display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 5,
    };

    return (
        <div className="relative w-[320px] h-[480px]">
            {cardImage && (
                <img
                    src={cardImage}
                    alt={name}
                    style={{
                        transform: `scale(${imageZoom}) translate(${imageX}px, ${imageY}px)`,
                        transformOrigin: '50% 50%',
                    }}
                />
            )}

            <img
                src={templateSrc}
                alt="Support Card Template"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
            />


            {skobian && (
                <img src="/images/tcg/skobian.png" alt="Skobian Tag"
                    style={{ position: 'absolute', top: '190px', left: '194px', width: '100px', zIndex: 3 }} />
            )}
            {littleguy && (
                <img src="/images/tcg/little-guy.png" alt="Little Guy Tag"
                    style={{ position: 'absolute', top: '190px', left: '194px', width: '100px', zIndex: 3 }} />
            )}
            {darkner && (
                <img src="/images/tcg/darkner.png" alt="Darkner Tag"
                    style={{ position: 'absolute', top: '190px', left: '194px', width: '100px', zIndex: 3 }} />
            )}

            <div style={nameStyle}>{parseDescription(name)}</div>
            <div style={titleStyle}>{title}</div>

            {iconSrc && (
                <div style={iconStyle}>
                    <img src={iconSrc} alt={`${supportType} icon`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
            )}

            <div style={rarityStyle}>{rarityString}</div>
            <div style={categoryStyle}>{category}</div>
            <div style={abilityStyle}>{ability}</div>

            <div style={descriptionStyle}>{parseDescription(description)}</div>
            <div style={flavourStyle}>{parseDescription(flavourText)}</div>

            <div style={energyCostContainerStyle}>
                {renderEnergyCostCircle(energyCostA, 0)}
                {renderEnergyCostCircle(energyCostB, 1)}
                {renderEnergyCostCircle(energyCostC, 2)}
                {renderEnergyCostCircle(energyCostD, 3)}
                {renderEnergyCostCircle(energyCostE, 4)}
            </div>
        </div>
    );
}

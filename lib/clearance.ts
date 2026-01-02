export const CLEARANCE_LEVELS: Record<number, { name: string; color: string }> = {
    1: { name: 'Civilian', color: 'text-gray-400' },
    2: { name: 'Client', color: 'text-blue-400' },
    3: { name: 'Standard Contractor', color: 'text-green-400' },
    4: { name: 'Engineer', color: 'text-purple-400' },
    5: { name: 'CEO', color: 'text-amber-500' },
};

export type ClearanceLevel = 1 | 2 | 3 | 4 | 5;

export function getClearanceInfo(level: number): { name: string; color: string } {
    const validLevel = level >= 1 && level <= 5 ? level : 1;
    return CLEARANCE_LEVELS[validLevel];
}

export function canAccessUploader(level: number): boolean {
    return level >= 3;
}

export function canAccessClientFeatures(level: number): boolean {
    return level >= 2;
}
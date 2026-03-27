import { useState, useEffect } from 'react';
import type { VehicleType } from '../utils/parseErpReport';

export function useFleet() {
    const [fleet, setFleet] = useState<VehicleType[]>([]);
    const [isFleetModalOpen, setIsFleetModalOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('logistics_fleet');
        if (saved) {
            try {
                setFleet(JSON.parse(saved));
            } catch (e) {
                console.error('Error parsing fleet', e);
            }
        }
    }, []);

    const saveFleet = (newFleet: VehicleType[]) => {
        setFleet(newFleet);
        localStorage.setItem('logistics_fleet', JSON.stringify(newFleet));
    };

    const clearFleet = () => {
        setFleet([]);
        localStorage.removeItem('logistics_fleet');
    };

    return {
        fleet,
        isFleetModalOpen,
        setIsFleetModalOpen,
        saveFleet,
        clearFleet,
    };
}

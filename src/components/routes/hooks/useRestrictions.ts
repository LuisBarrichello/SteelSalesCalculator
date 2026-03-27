import { useState, useEffect } from 'react';
import type { RestrictionsMap, CustomerRestriction } from '../types';
import { cleanCode } from '../utils/formatters';

export function useRestrictions() {
    const [restrictions, setRestrictions] = useState<RestrictionsMap>({});
    const [isRestrictionsModalOpen, setIsRestrictionsModalOpen] =
        useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('customerRestrictions');
        if (saved) {
            try {
                setRestrictions(JSON.parse(saved));
            } catch (e) {
                console.error('Error parsing restrictions', e);
            }
        }
    }, []);

    const saveRestriction = (form: CustomerRestriction) => {
        if (!form.code.trim()) return;
        const cleanedCode = cleanCode(form.code);
        const updated = {
            ...restrictions,
            [cleanedCode]: { ...form, code: cleanedCode },
        };
        setRestrictions(updated);
        localStorage.setItem('customerRestrictions', JSON.stringify(updated));
    };

    const deleteRestriction = (code: string) => {
        const updated = { ...restrictions };
        delete updated[code];
        setRestrictions(updated);
        localStorage.setItem('customerRestrictions', JSON.stringify(updated));
    };

    return {
        restrictions,
        isRestrictionsModalOpen,
        setIsRestrictionsModalOpen,
        saveRestriction,
        deleteRestriction,
    };
}

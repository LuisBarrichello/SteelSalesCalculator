import { useEffect, useState } from 'react';

export interface CalculationData {
    [key: string]: any;
}

export interface CalculationResult {
    [key: string]: any;
}

export interface CalculationHistoryItem {
    id: string;
    date: string;
    timestamp: number;
    type: 'bobininhas' | 'sapatas' | 'estribos' | 'colunas';
    data: CalculationData;
    result: CalculationResult;
    summary: string;
}

const MAX_HISTORY_ITEMS = 20;

export function useCalculationHistory(
    calculatorType: 'bobininhas' | 'sapatas' | 'estribos' | 'colunas',
) {
    const storageKey = `ssc_history_${calculatorType}`;

    const [history, setHistory] = useState<CalculationHistoryItem[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                setHistory(parsed);
            }
        } catch (error) {
            console.error('Failed to load history from localStorage:', error);
        }
    }, [storageKey]);

    const addToHistory = (
        data: CalculationData,
        result: CalculationResult,
        summary: string,
    ) => {
        const newItem: CalculationHistoryItem = {
            id: Date.now().toString(),
            date: new Date().toLocaleString('pt-BR'),
            timestamp: Date.now(),
            type: calculatorType,
            data,
            result,
            summary,
        };

        const updatedHistory = [newItem, ...history].slice(
            0,
            MAX_HISTORY_ITEMS,
        );

        setHistory(updatedHistory);
        localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    };

    const removeFromHistory = (id: string) => {
        const updatedHistory = history.filter((item) => item.id !== id);
        setHistory(updatedHistory);
        localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(storageKey);
    };

    const getHistoryItem = (id: string) => {
        return history.find((item) => item.id === id);
    };

    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        getHistoryItem,
    };
}

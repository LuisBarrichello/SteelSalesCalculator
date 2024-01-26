import { FormData } from "./CalculatorEstribos";
interface RebarData {
    weights: {
        [key: string]: number;
    };
    transpasses: {
        [key: string]: number;
    };
}


export const handleCalculation = (
    rebarData: RebarData, 
    FormData: FormData
    ): string => {
    const { shape, gauge, lengthSides, quantityTotal } = FormData;
    const { weights, transpasses } = rebarData;

    const weightGauge = weights[gauge]
    const transpasse = transpasses[gauge]

    if(weights[gauge] && transpasses[gauge]) {
        if(shape === 'square') {
            return calculationShapeSquare(
                weightGauge,
                {...lengthSides},
                quantityTotal,
                transpasse
            );
        } else if (shape === 'rectangular') {
            return calculationShapeRectangular(
                weightGauge,
                {...lengthSides},
                quantityTotal,
                transpasse
            );
        } else if(shape === 'triangular') {
            return calculationShapeTriangular(
                weightGauge,
                {...lengthSides},
                quantityTotal,
                transpasse
            );
        } else {
            return calculationShapeCircular(
                weightGauge,
                {...lengthSides},
                quantityTotal,
                transpasse
            );
        }
    }


    return "Invalid input or unsupported shape";
}

const calculationShapeSquare = (
        weightGauge: number, 
        lengthSides: {[key: string]: number}, 
        quantityTotal: number, 
        transpasse: number,
    ) => {
    
    const result = (quantityTotal * ((transpasse * 2) + (lengthSides[0] * 4)) * weightGauge) / 100;
    return result.toFixed(2)
}

const calculationShapeRectangular = (
        weightGauge: number, 
        lengthSides: {[key: string]: number}, 
        quantityTotal: number, 
        transpasse: number,
    ) => {
        const result = (quantityTotal * ((transpasse * 2) + (lengthSides[0] * 2) + (lengthSides[1] * 2)) * weightGauge) / 100;
        return result.toFixed(2)
}

const calculationShapeTriangular = (
        weightGauge: number, 
        lengthSides: {[key: string]: number}, 
        quantityTotal: number, 
        transpasse: number,
    ) => {

    const result = (quantityTotal * ((transpasse * 2) + (lengthSides[0] * 3)) * weightGauge) / 100;
    return result.toFixed(2)
}

const calculationShapeCircular = (
        weightGauge: number, 
        lengthSides: {[key: string]: number}, 
        quantityTotal: number, 
        transpasse: number,
    ) => {
        const pi = Math.PI;
        const circumference = 2 * pi * lengthSides[0];
        const result = (quantityTotal * ((transpasse * 2) + circumference) * weightGauge) / 100;
        return result.toFixed(2)
}
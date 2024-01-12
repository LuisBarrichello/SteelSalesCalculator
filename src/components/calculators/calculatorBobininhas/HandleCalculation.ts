/* Criar funcao de calcular cortes da bobininhas */

interface MaterialItem {
    thickness: string;
    weight: number;
}

interface DataCoil {
    [key: string]: MaterialItem[];
}

interface FormState {
    quantityOfCuts: number;
    qualityOfMaterial: string;
    thickness: number;
    quantityOfMeters: number;
    quantityOfCoil: number;
    hasCuts: boolean;
    cuts: { [key: string]: number };
}


const findSelectedMaterial = (dataCoil: DataCoil, qualityOfMaterial: string) => {
    return dataCoil[qualityOfMaterial];
}

const findSelectedThickness = (selectedMaterial: MaterialItem[], thickness: number): MaterialItem | undefined => {
    return selectedMaterial.find((item) => Number(item.thickness) === thickness);
}


export const handleCalculation = (formState: FormState, dataCoil: DataCoil,  ) => {
    try {
        if (!formState || !dataCoil) {
            throw new Error('Invalid input');
        }
        
        const { quantityOfCuts, qualityOfMaterial, thickness, quantityOfMeters, quantityOfCoil, cuts } = formState;
        
        if (quantityOfCuts === 0 && dataCoil && dataCoil[qualityOfMaterial]) {                
            const selectedMaterial = findSelectedMaterial(dataCoil, qualityOfMaterial);

            const selectedThickness = findSelectedThickness(selectedMaterial, thickness);
    
            if (selectedThickness) {
                const weight = quantityOfMeters * selectedThickness.weight * quantityOfCoil;
                return Array.from(weight.toFixed(2));
            }
        }

        if(quantityOfCuts !== 0 && dataCoil && dataCoil[qualityOfMaterial]) {
            const selectedMaterial = findSelectedMaterial(dataCoil, qualityOfMaterial);

            const selectedThickness = findSelectedThickness(selectedMaterial, thickness);

            const widthCoil = cuts && Object.values(cuts).reduce((acc, cut) => acc + cut, 0)
            
            console.log(cuts)

            console.log(widthCoil)
            
            if(widthCoil !== 1200) {
                throw new Error('Largura dos cortes não pode ser superior a 1200mm')
            }
            
            const weightCuts: number[] = []
            
            if(selectedThickness) {
                const cutsArray = Object.keys(cuts);
                console.log(cutsArray) // NaN
                Object.keys(cuts).forEach((cutIndex) => {
                    const itemCoilCut = cuts[cutIndex];
                    weightCuts.push(((selectedThickness.weight / widthCoil) * itemCoilCut) * quantityOfMeters).toFixed(2)
                })
                console.log(weightCuts)
    
                return weightCuts
            }
        }

    } catch (error) {
        console.error(`Error in handleCalculation: ${error}`);
        throw error;
    }
    
} 
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

const findSelectedMaterial = (
    dataCoil: DataCoil,
    qualityOfMaterial: string,
) => {
    return dataCoil[qualityOfMaterial];
};

const findSelectedThickness = (
    selectedMaterial: MaterialItem[],
    thickness: number,
): MaterialItem | undefined => {
    return selectedMaterial.find(
        (item) => Number(item.thickness) === Number(thickness),
    );
};

export const handleCalculation = (
    formState: FormState,
    dataCoil: DataCoil,
): number[] | undefined => {
    try {
        if (!formState || !dataCoil) {
            throw new Error('Invalid input');
        }

        const {
            quantityOfCuts,
            qualityOfMaterial,
            thickness,
            quantityOfMeters,
            quantityOfCoil,
            cuts,
        } = formState;

        if (dataCoil && dataCoil[qualityOfMaterial]) {
            const selectedMaterial = findSelectedMaterial(
                dataCoil,
                qualityOfMaterial,
            );
            const selectedThickness = findSelectedThickness(
                selectedMaterial,
                thickness,
            );

            if (quantityOfCuts === 0 && selectedThickness) {
                const weight =
                    quantityOfMeters *
                    selectedThickness.weight *
                    quantityOfCoil;
                return [Number(weight.toFixed(2))];
            }

            if (quantityOfCuts !== 0 && selectedThickness) {
                const widthCoil =
                    cuts &&
                    Object.values(cuts).reduce((acc, cut) => acc + cut, 0);

                if (widthCoil !== 1200) {
                    throw new Error(
                        'Largura dos cortes deve ser igual a 1200mm',
                    );
                }

                const weightCuts: number[] = [];
                const cutsArray = Object.keys(cuts);

                cutsArray.forEach((cutIndex) => {
                    const itemCoilCut = cuts[cutIndex];
                    const weight =
                        (selectedThickness.weight / widthCoil) *
                        itemCoilCut *
                        quantityOfMeters *
                        quantityOfCoil;
                    weightCuts.push(Number(weight.toFixed(2)));
                });

                return weightCuts;
            }
        }
        return undefined;
    } catch (error) {
        console.error(`Error in handleCalculation: ${error}`);
        throw error;
    }
};

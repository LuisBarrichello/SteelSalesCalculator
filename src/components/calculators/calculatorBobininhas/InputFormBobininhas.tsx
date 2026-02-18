import { Package, Ruler, Scissors } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../common/buttons/Button';
import { FormInput } from '../../common/forms/FormInput';

interface FormState {
    thickness: number;
    qualityOfMaterial: string;
    hasCuts: boolean;
    quantityOfCuts: number;
    quantityOfMeters: number;
    quantityOfCoil: number;
    cuts: Record<number, number>;
}

interface DataCoil {
    [key: string]: { thickness: string; weight: number }[];
}

interface Props {
    formState: FormState;
    dataCoil: DataCoil;
    handleInputChange: (
        field: string,
        value: string | number | boolean,
    ) => void;
    handleSubmit: () => void;
}

function InputFormBobininhas({
    formState,
    dataCoil,
    handleInputChange,
    handleSubmit,
}: Props) {
    const [widthCoil, setWidthCoil] = useState<number>(0);

    useEffect(() => {
        const totalWidth = Object.values(formState.cuts).reduce(
            (acc, item) => acc + item,
            0,
        );
        setWidthCoil(totalWidth);
    }, [formState.cuts]);

    const getThicknessValue = () => {
        if (!dataCoil || !dataCoil[formState.qualityOfMaterial]) return '';

        const materialData = dataCoil[formState.qualityOfMaterial];
        const match = materialData.find(
            (item) => Number(item.thickness) === formState.thickness,
        );

        return match ? match.thickness : formState.thickness.toString();
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-linear-to-r from-primary-600 to-primary-700 px-6 py-8 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Cálculo de Bobininhas
                        </h1>
                        <p className="text-primary-100 mt-1">
                            Configure os parâmetros da bobina
                        </p>
                    </div>
                </div>
            </div>

            <form className="p-6 sm:p-8 space-y-6">
                <FormInput
                    label="Qualidade do Material"
                    type="select"
                    value={formState.qualityOfMaterial}
                    onChange={(value) =>
                        handleInputChange('qualityOfMaterial', value)
                    }
                    required>
                    <option value="bgl">Galvalume</option>
                    <option value="azul">Azul</option>
                    <option value="branca">Branca</option>
                    <option value="cinza">Cinza</option>
                    <option value="vermelha">Vermelha</option>
                    <option value="preta">Preta</option>
                    <option value="ceramica">Cerâmica</option>
                    <option value="revestimento-x">Revestimento X</option>
                </FormInput>

                <FormInput
                    label="Espessura da Chapa"
                    type="select"
                    value={getThicknessValue()}
                    onChange={(value) =>
                        handleInputChange('thickness', Number(value))
                    }
                    required>
                    {dataCoil &&
                        dataCoil[formState.qualityOfMaterial] &&
                        dataCoil[formState.qualityOfMaterial].map(
                            (item, index: number) => (
                                <option key={index} value={item.thickness}>
                                    {item.thickness} mm
                                </option>
                            ),
                        )}
                </FormInput>

                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                        label="Quantidade de Bobininhas"
                        type="number"
                        value={formState.quantityOfCoil}
                        onChange={(value) =>
                            handleInputChange('quantityOfCoil', Number(value))
                        }
                        min={1}
                        error={formState.quantityOfCoil <= 0}
                        errorMessage="Deve ser maior que zero"
                        required
                    />

                    <FormInput
                        label="Quantidade de Metros"
                        type="number"
                        value={formState.quantityOfMeters}
                        onChange={(value) =>
                            handleInputChange('quantityOfMeters', value)
                        }
                        min={15}
                        error={formState.quantityOfMeters < 15}
                        errorMessage="Mínimo de 15 metros"
                        required
                    />
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-medium text-steel-700">
                        Possui cortes? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="hasCuts"
                                value="true"
                                checked={String(formState.hasCuts) === 'true'}
                                onChange={(e) =>
                                    handleInputChange('hasCuts', e.target.value)
                                }
                                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-steel-700">Sim</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="hasCuts"
                                value="false"
                                checked={String(formState.hasCuts) === 'false'}
                                onChange={(e) =>
                                    handleInputChange('hasCuts', e.target.value)
                                }
                                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-steel-700">Não</span>
                        </label>
                    </div>
                </div>

                {formState.hasCuts && (
                    <div className="bg-steel-50 rounded-xl p-6 space-y-6 border-2 border-steel-200">
                        <div className="flex items-center gap-2 text-steel-700">
                            <Scissors className="w-5 h-5" />
                            <h3 className="font-semibold">
                                Configuração dos Cortes
                            </h3>
                        </div>

                        <FormInput
                            label="Quantidade de Cortes"
                            type="number"
                            value={formState.quantityOfCuts}
                            onChange={(value) =>
                                handleInputChange(
                                    'quantityOfCuts',
                                    Number(value),
                                )
                            }
                            min={2}
                            max={6}
                            error={
                                formState.quantityOfCuts < 1 ||
                                formState.quantityOfCuts > 6
                            }
                            errorMessage="Entre 2 e 6 cortes"
                            required
                        />

                        <div className="space-y-4">
                            {[...Array(formState.quantityOfCuts)].map(
                                (_, index) => (
                                    <FormInput
                                        key={index}
                                        label={`Largura do Corte ${index + 1}`}
                                        type="number"
                                        value={formState.cuts[index] || ''}
                                        onChange={(value) =>
                                            handleInputChange(
                                                `cutWidth_${index}`,
                                                Number(value),
                                            )
                                        }
                                        min={100}
                                        max={1200}
                                        error={
                                            widthCoil !== 1200 &&
                                            formState.quantityOfCuts ===
                                                Object.keys(formState.cuts)
                                                    .length
                                        }
                                        errorMessage={
                                            widthCoil > 1200
                                                ? `Excedeu ${widthCoil - 1200}mm - Total deve ser 1200mm`
                                                : `Falta ${1200 - widthCoil}mm - Total deve ser 1200mm`
                                        }
                                    />
                                ),
                            )}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-steel-200">
                            <div className="flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-steel-600" />
                                <span className="text-sm font-medium text-steel-700">
                                    Largura Total:
                                </span>
                            </div>
                            <span
                                className={`text-lg font-bold ${
                                    widthCoil === 1200
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`}>
                                {widthCoil} / 1200 mm
                            </span>
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <Button
                        onClick={handleSubmit}
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={<Package className="w-5 h-5" />}>
                        Calcular Bobininhas
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default InputFormBobininhas;

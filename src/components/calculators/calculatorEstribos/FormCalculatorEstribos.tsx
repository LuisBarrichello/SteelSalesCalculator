import {
    Layers,
    Triangle,
    Square,
    Circle,
    RectangleHorizontal,
} from 'lucide-react';
import rebarData from '../../../data/rebarData.json';
import { handleCalculation } from './HandleCalculation';
import { FormData, ResultInterface } from './CalculatorEstribos';
import { FormInput } from '../../common/forms/FormInput';
import { Button } from '../../common/buttons/Button';

interface FormProps {
    setResult: (result: ResultInterface) => void;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    formData: FormData;
}

function FormCalculatorEstribos({
    setResult,
    setFormData,
    formData,
}: FormProps) {
    const handleInputChange = (
        field: string,
        value: string | boolean | number,
    ) => {
        if (field === 'shape') {
            if (typeof value === 'string') {
                setFormData((prevState: FormData) => ({
                    ...prevState,
                    [field]: value,
                    quantitySide: value === 'rectangular' ? 2 : 1,
                }));
            }
        } else if (field.startsWith('lengthSides_')) {
            const indexSide = field.split('_')[1];
            const sides = {
                ...formData.lengthSides,
                [indexSide]: Number(value),
            };
            setFormData((prevState: FormData) => ({
                ...prevState,
                lengthSides: sides,
            }));
        } else {
            setFormData((prevState: FormData) => ({
                ...prevState,
                [field]: value,
            }));
        }
    };

    const handleSubmit = () => {
        const weight = Number(handleCalculation(rebarData, formData));
        setResult({
            status: true,
            weight: weight,
            ...formData,
        });
    };

    const shapeIcons = {
        square: Square,
        rectangular: RectangleHorizontal,
        triangular: Triangle,
        circular: Circle,
    };

    const shapeLabels = {
        square: 'Quadrado',
        rectangular: 'Retangular',
        triangular: 'Triangular',
        circular: 'Circular',
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-700 px-6 py-8 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Cálculo de Estribos
                        </h1>
                        <p className="text-amber-100 mt-1">
                            Configure forma, bitola e dimensões
                        </p>
                    </div>
                </div>
            </div>

            <form className="p-6 sm:p-8 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                        Formato do Estribo
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(shapeIcons).map(([shape, Icon]) => (
                            <button
                                key={shape}
                                type="button"
                                onClick={() =>
                                    handleInputChange('shape', shape)
                                }
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    formData.shape === shape
                                        ? 'border-amber-500 bg-amber-50 shadow-md'
                                        : 'border-steel-200 hover:border-amber-300 hover:bg-steel-50'
                                }`}>
                                <Icon
                                    className={`w-8 h-8 mx-auto mb-2 ${
                                        formData.shape === shape
                                            ? 'text-amber-600'
                                            : 'text-steel-400'
                                    }`}
                                />
                                <span
                                    className={`text-sm font-medium ${
                                        formData.shape === shape
                                            ? 'text-amber-700'
                                            : 'text-steel-600'
                                    }`}>
                                    {
                                        shapeLabels[
                                            shape as keyof typeof shapeLabels
                                        ]
                                    }
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                        label="Bitola (mm)"
                        type="select"
                        value={formData.gauge}
                        onChange={(value) =>
                            handleInputChange('gauge', Number(value))
                        }
                        required>
                        <option value="4.2">4.2 mm</option>
                        <option value="5">5.0 mm</option>
                        <option value="6.3">6.3 mm</option>
                        <option value="8">8.0 mm</option>
                        <option value="10">10.0 mm</option>
                        <option value="12.5">12.5 mm</option>
                        <option value="16">16.0 mm</option>
                        <option value="20">20.0 mm</option>
                    </FormInput>

                    <FormInput
                        label="Quantidade Total de Estribos"
                        type="number"
                        value={formData.quantityTotal}
                        onChange={(value) =>
                            handleInputChange('quantityTotal', Number(value))
                        }
                        min={1}
                        error={formData.quantityTotal === 0}
                        errorMessage="Deve ser maior que zero"
                        required
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                        {formData.shape === 'circular'
                            ? 'Raio do Estribo'
                            : 'Dimensões do Estribo'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[...Array(formData.quantitySide)].map((_, index) => (
                            <FormInput
                                key={index}
                                label={
                                    formData.shape === 'circular'
                                        ? 'Raio (cm)'
                                        : formData.shape === 'rectangular'
                                            ? index === 0
                                                ? 'Lado maior (cm)'
                                                : 'Lado menor (cm)'
                                            : 'Tamanho do Lado (cm)'
                                }
                                type="number"
                                value={formData.lengthSides[index] || ''}
                                onChange={(value) =>
                                    handleInputChange(
                                        `lengthSides_${index}`,
                                        value,
                                    )
                                }
                                min={1}
                                error={
                                    Object.keys(formData.lengthSides).length ===
                                    0
                                }
                                errorMessage="Deve ser maior que a bitola em centímetros"
                                required
                            />
                        ))}
                    </div>
                </div>

                {formData.shape === 'circular' &&
                    formData.lengthSides[0] > 0 && (
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-amber-900">
                                    Diâmetro calculado:
                                </span>
                                <span className="text-xl font-bold text-amber-700">
                                    {formData.lengthSides[0] * 2} cm
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
                        icon={<Layers className="w-5 h-5" />}>
                        Calcular Estribos
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default FormCalculatorEstribos;

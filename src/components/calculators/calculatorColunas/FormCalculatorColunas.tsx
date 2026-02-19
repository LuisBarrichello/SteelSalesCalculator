import { useForm, SubmitHandler } from 'react-hook-form';
import {
    Columns,
    Square,
    RectangleHorizontal,
    Triangle,
    Circle,
} from 'lucide-react';
import { Button } from '../../common/buttons/Button';

interface dataColunas {
    numberOfColumns: number;
    numberOfIronBars: number;
    stirrupSpacing: number;
    gaugeIronBars: number;
    metersOfColumns: number;
    metersHaveStirrup: number;
    numberOfStirrupsPerColumns: number;
    stirrupMeasurements: {
        shape: ShapeEnum;
        gauge: number;
        lengthSides: {
            length1?: number;
            length2?: number;
            radius?: number;
        };
    };
}

enum ShapeEnum {
    square = 'square',
    rectangular = 'rectangular',
    triangular = 'triangular',
    circular = 'circular',
}

interface FormCalculatorColunasProps {
    onSubmit: (data: dataColunas) => void;
}

const FormCalculatorColunas = ({ onSubmit }: FormCalculatorColunasProps) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<dataColunas>();

    const shapeValue = watch('stirrupMeasurements.shape');

    const handleFormSubmit: SubmitHandler<dataColunas> = (data) => {
        onSubmit(data);
    };

    const shapeOptions = [
        { value: 'square', label: 'Quadrado', icon: Square },
        {
            value: 'rectangular',
            label: 'Retangular',
            icon: RectangleHorizontal,
        },
        { value: 'triangular', label: 'Triangular', icon: Triangle },
        { value: 'circular', label: 'Circular', icon: Circle },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-8 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <Columns className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Cálculo de Colunas
                        </h1>
                        <p className="text-emerald-100 mt-1">
                            Dimensionamento completo de colunas estruturais
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="p-6 sm:p-8 space-y-8">
                <div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                        Configuração das Colunas
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-steel-700">
                                Quantidade de Colunas{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                    errors.numberOfColumns
                                        ? 'border-red-300'
                                        : 'border-steel-200'
                                }`}
                                {...register('numberOfColumns', {
                                    required: true,
                                    min: 1,
                                })}
                            />
                            {errors.numberOfColumns && (
                                <p className="text-sm text-red-600">
                                    Deve ser maior que 0
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-steel-700">
                                Ferros por Coluna{' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                    errors.numberOfIronBars
                                        ? 'border-red-300'
                                        : 'border-steel-200'
                                }`}
                                {...register('numberOfIronBars', {
                                    required: true,
                                    min: 3,
                                })}
                            />
                            {errors.numberOfIronBars && (
                                <p className="text-sm text-red-600">
                                    Deve ser maior que 2
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-steel-700">
                                Tamanho das Colunas (metros){' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                    errors.metersOfColumns
                                        ? 'border-red-300'
                                        : 'border-steel-200'
                                }`}
                                {...register('metersOfColumns', {
                                    required: true,
                                    min: 0.01,
                                })}
                            />
                            {errors.metersOfColumns && (
                                <p className="text-sm text-red-600">
                                    Deve ser maior que 0
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-steel-700">
                                Metragem com Estribos (metros){' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                    errors.metersHaveStirrup
                                        ? 'border-red-300'
                                        : 'border-steel-200'
                                }`}
                                {...register('metersHaveStirrup', {
                                    required: true,
                                    min: 1,
                                })}
                            />
                            {errors.metersHaveStirrup && (
                                <p className="text-sm text-red-600">
                                    Deve ser maior que 0
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-steel-700">
                                Bitola dos Ferros (mm){' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                    errors.gaugeIronBars
                                        ? 'border-red-300'
                                        : 'border-steel-200'
                                }`}
                                {...register('gaugeIronBars', {
                                    required: true,
                                })}>
                                <option value="4.2">4.2 mm</option>
                                <option value="5">5.0 mm</option>
                                <option value="6.3">6.3 mm</option>
                                <option value="8">8.0 mm</option>
                                <option value="10">10.0 mm</option>
                                <option value="12.5">12.5 mm</option>
                                <option value="16">16.0 mm</option>
                                <option value="20">20.0 mm</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-steel-700">
                                Espaçamento dos Estribos (cm){' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                    errors.stirrupSpacing
                                        ? 'border-red-300'
                                        : 'border-steel-200'
                                }`}
                                {...register('stirrupSpacing', {
                                    required: true,
                                    min: 1,
                                })}
                            />
                            {errors.stirrupSpacing && (
                                <p className="text-sm text-red-600">
                                    Deve ser maior que 0
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                        Configuração dos Estribos
                    </h3>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-steel-700 mb-3">
                            Formato do Estribo{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {shapeOptions.map(
                                ({ value, label, icon: Icon }) => (
                                    <label
                                        key={value}
                                        className="cursor-pointer">
                                        <input
                                            type="radio"
                                            value={value}
                                            {...register(
                                                'stirrupMeasurements.shape',
                                                { required: true },
                                            )}
                                            className="sr-only peer"
                                        />
                                        <div className="p-4 rounded-xl border-2 transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 border-steel-200 hover:border-emerald-300 hover:bg-steel-50">
                                            <Icon className="w-8 h-8 mx-auto mb-2 peer-checked:text-emerald-600 text-steel-400" />
                                            <span className="text-sm font-medium peer-checked:text-emerald-700 text-steel-600">
                                                {label}
                                            </span>
                                        </div>
                                    </label>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {shapeValue === 'rectangular' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-steel-700">
                                        Lado 1 (cm){' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                            errors.stirrupMeasurements
                                                ?.lengthSides?.length1
                                                ? 'border-red-300'
                                                : 'border-steel-200'
                                        }`}
                                        {...register(
                                            'stirrupMeasurements.lengthSides.length1',
                                            {
                                                required: true,
                                                min: 1,
                                            },
                                        )}
                                    />
                                    {errors.stirrupMeasurements?.lengthSides
                                        ?.length1 && (
                                        <p className="text-sm text-red-600">
                                            Deve ser maior que 0
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-steel-700">
                                        Lado 2 (cm){' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                            errors.stirrupMeasurements
                                                ?.lengthSides?.length2
                                                ? 'border-red-300'
                                                : 'border-steel-200'
                                        }`}
                                        {...register(
                                            'stirrupMeasurements.lengthSides.length2',
                                            {
                                                required: true,
                                                min: 1,
                                            },
                                        )}
                                    />
                                    {errors.stirrupMeasurements?.lengthSides
                                        ?.length2 && (
                                        <p className="text-sm text-red-600">
                                            Deve ser maior que 0
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-steel-700">
                                    {shapeValue === 'circular'
                                        ? 'Raio (cm)'
                                        : 'Tamanho dos Lados (cm)'}{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                        shapeValue === 'circular'
                                            ? errors.stirrupMeasurements
                                                  ?.lengthSides?.radius
                                                ? 'border-red-300'
                                                : 'border-steel-200'
                                            : errors.stirrupMeasurements
                                                    ?.lengthSides?.length1
                                              ? 'border-red-300'
                                              : 'border-steel-200'
                                    }`}
                                    {...register(
                                        shapeValue === 'circular'
                                            ? 'stirrupMeasurements.lengthSides.radius'
                                            : 'stirrupMeasurements.lengthSides.length1',
                                        {
                                            required: true,
                                            min: 1,
                                        },
                                    )}
                                />
                                {((shapeValue === 'circular' &&
                                    errors.stirrupMeasurements?.lengthSides
                                        ?.radius) ||
                                    (shapeValue !== 'circular' &&
                                        errors.stirrupMeasurements?.lengthSides
                                            ?.length1)) && (
                                    <p className="text-sm text-red-600">
                                        Deve ser maior que 0
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-steel-700">
                                Bitola dos Estribos (mm){' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                                    errors.stirrupMeasurements?.gauge
                                        ? 'border-red-300'
                                        : 'border-steel-200'
                                }`}
                                {...register('stirrupMeasurements.gauge', {
                                    required: true,
                                })}>
                                <option value="4.2">4.2 mm</option>
                                <option value="5">5.0 mm</option>
                                <option value="6.3">6.3 mm</option>
                                <option value="8">8.0 mm</option>
                                <option value="10">10.0 mm</option>
                                <option value="12.5">12.5 mm</option>
                                <option value="16">16.0 mm</option>
                                <option value="20">20.0 mm</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={<Columns className="w-5 h-5" />}>
                        Calcular Colunas
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FormCalculatorColunas;

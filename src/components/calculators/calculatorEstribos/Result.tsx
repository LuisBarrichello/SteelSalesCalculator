import { ResultInterface } from './CalculatorEstribos';
import { Layers, RefreshCw, Printer, AlertCircle } from 'lucide-react';
import { Button } from '../../common/buttons/Button';
import ImgEstriboCircular from '../../../assets/img/estribo-circular.png';
import ImgEstriboTriangular from '../../../assets/img/estribo-triangular.png';
import ImgEstriboRetangular from '../../../assets/img/estribo-retangular.png';
import ImgEstriboQuadrado from '../../../assets/img/estribo-quadrado.png';

interface ResultProps {
    result: ResultInterface;
    resetForm: () => void;
}

interface ComponentesPorShape {
    [key: string]: () => JSX.Element;
}

const EstriboCircular = () => (
    <img
        src={ImgEstriboCircular}
        alt="estribo circular"
        className="max-w-[250px] w-full h-auto drop-shadow-lg"
    />
);

const EstriboTriangular = () => (
    <img
        src={ImgEstriboTriangular}
        alt="estribo triangular"
        className="max-w-[250px] w-full h-auto drop-shadow-lg"
    />
);

const EstriboRetangular = () => (
    <img
        src={ImgEstriboRetangular}
        alt="estribo retangular"
        className="max-w-[250px] w-full h-auto drop-shadow-lg"
    />
);

const EstriboQuadrado = () => (
    <img
        src={ImgEstriboQuadrado}
        alt="estribo quadrado"
        className="max-w-[250px] w-full h-auto drop-shadow-lg"
    />
);

const componentePorShape: ComponentesPorShape = {
    circular: EstriboCircular,
    triangular: EstriboTriangular,
    rectangular: EstriboRetangular,
    square: EstriboQuadrado,
};

const shapeLabels: { [key: string]: string } = {
    square: 'Quadrado',
    rectangular: 'Retangular',
    triangular: 'Triangular',
    circular: 'Circular',
};

function Result({ result, resetForm }: ResultProps) {
    const ImageEstribo = componentePorShape[result.shape] || EstriboRetangular;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-8 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Layers className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Resultado do Cálculo
                            </h1>
                            <p className="text-green-100 mt-1">
                                Estribos - {shapeLabels[result.shape]}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-steel-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        #
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Quantidade
                                    </th>
                                    {result.shape === 'circular' && (
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                            Diâmetro
                                        </th>
                                    )}
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Bitola
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-steel-700">
                                        Peso Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-steel-50 transition-colors">
                                    <td className="py-4 px-4 text-steel-600">
                                        1
                                    </td>
                                    <td className="py-4 px-4 text-steel-900 font-medium">
                                        {result.quantityTotal}
                                    </td>
                                    {result.shape === 'circular' && (
                                        <td className="py-4 px-4 text-steel-900">
                                            {result.lengthSides[0] * 2} cm
                                        </td>
                                    )}
                                    <td className="py-4 px-4">
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-sm font-medium">
                                            {result.gauge} mm
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="text-2xl font-bold text-amber-600">
                                            {result.weight} Kg
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button
                            onClick={resetForm}
                            variant="primary"
                            size="lg"
                            icon={<RefreshCw className="w-5 h-5" />}
                            fullWidth>
                            Refazer Cálculo
                        </Button>
                        <Button
                            onClick={() => window.print()}
                            variant="ghost"
                            size="lg"
                            icon={<Printer className="w-5 h-5" />}
                            fullWidth>
                            Imprimir
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:hidden">
                <div className="bg-steel-100 px-6 py-4 border-b border-steel-200">
                    <h3 className="text-lg font-semibold text-steel-900">
                        Visualização do Estribo
                    </h3>
                </div>
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center gap-3 mt-8">
                                <div className="relative">
                                    {result.shape !== 'circular' &&
                                        result.lengthSides[0] && (
                                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold whitespace-nowrap">
                                                    {result.lengthSides[0]} cm
                                                </span>
                                            </div>
                                        )}

                                    <ImageEstribo />
                                </div>
                                {result.shape === 'rectangular' &&
                                    result.lengthSides[1] && (
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold whitespace-nowrap">
                                            {result.lengthSides[1]} cm
                                        </span>
                                    )}
                            </div>
                        </div>

                        <div className="space-y-4 w-full md:w-auto">
                            <div className="bg-steel-50 rounded-xl p-4 border-2 border-steel-200">
                                <div className="text-sm text-steel-600 mb-1">
                                    Formato
                                </div>
                                <div className="text-lg font-bold text-steel-900">
                                    {shapeLabels[result.shape]}
                                </div>
                            </div>

                            <div className="bg-steel-50 rounded-xl p-4 border-2 border-steel-200">
                                <div className="text-sm text-steel-600 mb-1">
                                    Bitola
                                </div>
                                <div className="text-lg font-bold text-steel-900">
                                    {result.gauge} mm
                                </div>
                            </div>

                            {result.shape === 'circular' && (
                                <div className="bg-steel-50 rounded-xl p-4 border-2 border-steel-200">
                                    <div className="text-sm text-steel-600 mb-1">
                                        Diâmetro
                                    </div>
                                    <div className="text-lg font-bold text-steel-900">
                                        {result.lengthSides[0] * 2} cm
                                    </div>
                                </div>
                            )}

                            <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                                <div className="text-sm text-amber-700 mb-1">
                                    Peso Total
                                </div>
                                <div className="text-2xl font-bold text-amber-600">
                                    {result.weight} Kg
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="print:hidden">
                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-amber-900 mb-2">
                                Dobra Mínima - Transpasses
                            </h4>
                            <p className="text-amber-800">
                                Dobra mínima dos transpasses{' '}
                                <strong>é proporcional à bitola.</strong> Ex:
                                6.3mm = 6cm
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Result;

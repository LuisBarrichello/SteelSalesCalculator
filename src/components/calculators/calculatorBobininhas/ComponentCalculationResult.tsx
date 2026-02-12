import { Package, RefreshCw, Printer, AlertCircle } from 'lucide-react';
import { Button } from '../../common/buttons/Button';

interface Result {
    weight: number[];
    quantityOfMeters: number;
    quantityOfCoil: number;
    qualityOfMaterial: string;
    quantityOfCuts: number;
    hasCuts: boolean;
    cuts: { [key: string]: number };
    thickness: number;
    status: boolean;
}

interface Props {
    result: Result;
    resetForm: () => void;
}

function ComponentCalculationResult({ result, resetForm }: Props) {
    const { hasCuts, cuts } = result;
    const totalWeight = Number(result.weight.reduce((acc, item) => acc + item, 0));

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-8 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Resultado do Cálculo
                            </h1>
                            <p className="text-green-100 mt-1">
                                Bobininhas -{' '}
                                {result.qualityOfMaterial.toUpperCase()}
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
                                        Bobinas
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Material
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Espessura
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Largura
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Comprimento
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-steel-700">
                                        Peso
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-steel-100">
                                {hasCuts ? (
                                    Object.keys(cuts).map((_, cutIndex) => (
                                        <tr
                                            key={cutIndex}
                                            className="hover:bg-steel-50 transition-colors">
                                            <td className="py-4 px-4 text-steel-600">
                                                {cutIndex + 1}
                                            </td>
                                            <td className="py-4 px-4 text-steel-900 font-medium">
                                                {result.quantityOfCoil}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm font-medium">
                                                    {result.qualityOfMaterial.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-steel-900">
                                                {result.thickness} mm
                                            </td>
                                            <td className="py-4 px-4 text-steel-900">
                                                {cuts[cutIndex]} mm
                                            </td>
                                            <td className="py-4 px-4 text-steel-900">
                                                {result.quantityOfMeters} m
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <span className="font-semibold text-primary-600">
                                                    {result.weight[
                                                        cutIndex
                                                    ].toFixed(2)}{' '}
                                                    Kg
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="hover:bg-steel-50 transition-colors">
                                        <td className="py-4 px-4 text-steel-600">
                                            1
                                        </td>
                                        <td className="py-4 px-4 text-steel-900 font-medium">
                                            {result.quantityOfCoil}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm font-medium">
                                                {result.qualityOfMaterial.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-steel-900">
                                            {result.thickness} mm
                                        </td>
                                        <td className="py-4 px-4 text-steel-900">
                                            1200 mm
                                        </td>
                                        <td className="py-4 px-4 text-steel-900">
                                            {result.quantityOfMeters} m
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="font-semibold text-primary-600">
                                                {result.weight} Kg
                                            </span>
                                        </td>
                                    </tr>
                                )}
                                <tr className="bg-steel-50 font-bold">
                                    <td
                                        colSpan={6}
                                        className="py-4 px-4 text-steel-900">
                                        Peso Total
                                    </td>
                                    <td className="py-4 px-4 text-right text-primary-700 text-lg">
                                        {totalWeight.toFixed(2)} Kg
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

            <div className="print:hidden space-y-4">
                <h3 className="text-xl font-bold text-steel-900">
                    Observações Importantes
                </h3>

                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-900 mb-2">
                                Peso Máximo por Corte
                            </h4>
                            <p className="text-red-800">
                                Peso por montagem é limitado a{' '}
                                <strong>500 Kgs máximo</strong>, devido ao
                                limite do eixo de saída da máquina.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-900 mb-2">
                                Quantidade de Cortes
                            </h4>
                            <p className="text-red-800">
                                No máximo{' '}
                                <strong>6 cortes em uma bobina</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComponentCalculationResult;

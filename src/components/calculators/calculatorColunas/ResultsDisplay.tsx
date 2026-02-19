import { DataResultColunasInterface } from './CalculatorColunas';
import { Columns, RefreshCw, Printer, AlertCircle } from 'lucide-react';
import { Button } from '../../common/buttons/Button';
import ImgColuna from '../../../assets/img/coluna.png';

interface Props {
    result: DataResultColunasInterface;
    resetForm: () => void;
}

const ResultsDisplay = ({ result, resetForm }: Props) => {
    const shape = result.stirrupMeasurements?.shape;
    const radius = result.stirrupMeasurements?.lengthSides?.radius ?? 0;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-8 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Columns className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Resultado do Cálculo
                            </h1>
                            <p className="text-green-100 mt-1">
                                Barras Estruturais e Estribos
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <h3 className="text-xl font-semibold text-steel-900 mb-4">
                        Barras
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-steel-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Total de Colunas
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Tamanho
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Barras/Coluna
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Total Barras
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Ø
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-steel-700">
                                        Peso
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-steel-50 transition-colors">
                                    <td className="py-4 px-4 text-steel-900 font-medium">
                                        {result.numberOfColumns}
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {result.metersOfColumns} m
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {result.numberOfIronBars}
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {result.totalNumberOfBars}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-sm font-medium">
                                            {result.gaugeIronBars} mm
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="font-semibold text-emerald-600">
                                            {result.totalWeightOfBars?.toFixed(
                                                2,
                                            )}{' '}
                                            kg
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8">
                    <h3 className="text-xl font-semibold text-steel-900 mb-4">
                        Estribos
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-steel-200">
                                    {shape !== 'circular' && (
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                            Dimensões
                                        </th>
                                    )}
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Estribos/Coluna
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Total Estribos
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Ø
                                    </th>
                                    {shape === 'circular' && (
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                            Diâmetro
                                        </th>
                                    )}
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Espaçamento
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-steel-700">
                                        Peso
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-steel-50 transition-colors">
                                    {shape === 'rectangular' && (
                                        <td className="py-4 px-4 text-steel-900">
                                            {
                                                result.stirrupMeasurements
                                                    ?.lengthSides?.length1
                                            }{' '}
                                            x{' '}
                                            {
                                                result.stirrupMeasurements
                                                    ?.lengthSides?.length2
                                            }{' '}
                                            cm
                                        </td>
                                    )}
                                    {shape === 'triangular' && (
                                        <td className="py-4 px-4 text-steel-900">
                                            {
                                                result.stirrupMeasurements
                                                    ?.lengthSides?.length1
                                            }{' '}
                                            x{' '}
                                            {
                                                result.stirrupMeasurements
                                                    ?.lengthSides?.length1
                                            }{' '}
                                            x{' '}
                                            {
                                                result.stirrupMeasurements
                                                    ?.lengthSides?.length1
                                            }{' '}
                                            cm
                                        </td>
                                    )}
                                    {shape === 'square' && (
                                        <td className="py-4 px-4 text-steel-900">
                                            {
                                                result.stirrupMeasurements
                                                    ?.lengthSides?.length1
                                            }{' '}
                                            x{' '}
                                            {
                                                result.stirrupMeasurements
                                                    ?.lengthSides?.length1
                                            }{' '}
                                            cm
                                        </td>
                                    )}
                                    <td className="py-4 px-4 text-steel-900 font-medium">
                                        {result.numberOfStirrupsPerColumns}
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {result.totalNumberOfStirrups}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-sm font-medium">
                                            {result.stirrupMeasurements?.gauge}{' '}
                                            mm
                                        </span>
                                    </td>
                                    {shape === 'circular' && (
                                        <td className="py-4 px-4 text-steel-900">
                                            {radius * 2} cm
                                        </td>
                                    )}
                                    <td className="py-4 px-4 text-steel-900">
                                        {result.stirrupSpacing} cm
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="font-semibold text-emerald-600">
                                            {result.totalWeightOfStirrups?.toFixed(
                                                2,
                                            )}{' '}
                                            kg
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button
                            onClick={() => resetForm()}
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

            <div className="grid md:grid-cols-2 gap-6 print:hidden">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-steel-100 px-6 py-4 border-b border-steel-200">
                        <h3 className="text-lg font-semibold text-steel-900">
                            Representação Visual
                        </h3>
                    </div>
                    <div className="p-6 flex justify-center items-center">
                        <img
                            src={ImgColuna}
                            alt="Coluna"
                            className="max-w-xs w-full h-auto drop-shadow-lg"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-steel-900">
                        Observações Importantes
                    </h3>
                    <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
                        <div className="flex gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-amber-900 mb-2">
                                    Dobra Mínima - Transpasses
                                </h4>
                                <p className="text-amber-800">
                                    Dobra mínima dos transpasses{' '}
                                    <strong>é proporcional à bitola.</strong>{' '}
                                    Ex: 6.3mm = 6cm
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
                            <div className="text-sm text-emerald-700 mb-1">
                                Peso Total Barras
                            </div>
                            <div className="text-2xl font-bold text-emerald-600">
                                {result.totalWeightOfBars?.toFixed(2)} kg
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
                            <div className="text-sm text-emerald-700 mb-1">
                                Peso Total Estribos
                            </div>
                            <div className="text-2xl font-bold text-emerald-600">
                                {result.totalWeightOfStirrups?.toFixed(2)} kg
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;

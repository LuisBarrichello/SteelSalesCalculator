import { FormEvent } from 'react';
import { Grid3x3, RefreshCw, Printer, AlertCircle } from 'lucide-react';
import { Button } from '../../common/buttons/Button';
import ImgSapata from '../../../assets/img/sapataImgWithOutBG.png';
import ImgEstribo from '../../../assets/img/estribo.png';

interface ResultsDisplayProps {
    bitola: string;
    quantidadeDeFerros: number;
    quantidadeDeSapatas: number;
    largura: number;
    altura: number;
    comprimento: number;
    weightEstribos: number;
    weightEstribosLess2: number;
    returnForm: (event: FormEvent) => void;
}

function ResultsDisplay({
    bitola,
    quantidadeDeFerros,
    quantidadeDeSapatas,
    largura,
    altura,
    comprimento,
    weightEstribos,
    weightEstribosLess2,
    returnForm,
}: ResultsDisplayProps) {
    const totalWeight = weightEstribos + weightEstribosLess2;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-8 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Grid3x3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Resultado do Cálculo
                            </h1>
                            <p className="text-green-100 mt-1">
                                Sapatas e Estribos
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
                                        Bitola
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Estribos/Sapata
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Total Estribos
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Largura
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                        Comprimento
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-steel-700">
                                        Peso Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-steel-100">
                                <tr className="hover:bg-steel-50 transition-colors">
                                    <td className="py-4 px-4 text-steel-600">
                                        1
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-md text-sm font-medium">
                                            {bitola} mm
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-steel-900 font-medium">
                                        {quantidadeDeFerros / 2}
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {(quantidadeDeFerros / 2) *
                                            quantidadeDeSapatas}
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {largura} cm
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {altura} cm
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="font-semibold text-violet-600">
                                            {weightEstribos.toFixed(2)} Kg
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-steel-50 transition-colors">
                                    <td className="py-4 px-4 text-steel-600">
                                        2
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-md text-sm font-medium">
                                            {bitola} mm
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-steel-900 font-medium">
                                        {quantidadeDeFerros / 2}
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {(quantidadeDeFerros / 2) *
                                            quantidadeDeSapatas}
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {comprimento} cm
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {altura - 2} cm
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="font-semibold text-violet-600">
                                            {weightEstribosLess2.toFixed(2)} Kg
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-steel-50 font-bold">
                                    <td
                                        colSpan={2}
                                        className="py-4 px-4 text-steel-900">
                                        Total
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {quantidadeDeFerros}
                                    </td>
                                    <td className="py-4 px-4 text-steel-900">
                                        {quantidadeDeFerros *
                                            quantidadeDeSapatas}
                                    </td>
                                    <td
                                        colSpan={2}
                                        className="py-4 px-4 text-steel-900"></td>
                                    <td className="py-4 px-4 text-right text-violet-700 text-lg">
                                        {totalWeight.toFixed(2)} Kg
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 bg-violet-50 border-2 border-violet-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-steel-700 font-medium">
                                Quantidade Total de Sapatas:
                            </span>
                            <span className="text-3xl font-bold text-violet-700">
                                {quantidadeDeSapatas}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button
                            onClick={() => returnForm({} as FormEvent)}
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
                        Montagem das Sapatas
                    </h3>
                </div>
                <div className="p-6 sm:p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="flex justify-center">
                            <img
                                src={ImgSapata}
                                alt="Sapata"
                                className="max-w-full h-auto drop-shadow-lg"
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="bg-steel-50 rounded-xl p-6 border-2 border-steel-200">
                                <h4 className="font-semibold text-steel-900 mb-4">
                                    Estribo Tipo 1
                                </h4>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={ImgEstribo}
                                        alt="Estribo"
                                        className="w-20 h-20"
                                    />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-steel-600">
                                                Altura:
                                            </span>
                                            <span className="font-bold text-steel-900">
                                                {altura} cm
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-steel-600">
                                                Largura:
                                            </span>
                                            <span className="font-bold text-steel-900">
                                                {largura} cm
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-steel-50 rounded-xl p-6 border-2 border-steel-200">
                                <h4 className="font-semibold text-steel-900 mb-4">
                                    Estribo Tipo 2
                                </h4>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={ImgEstribo}
                                        alt="Estribo"
                                        className="w-20 h-20"
                                    />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-steel-600">
                                                Altura:
                                            </span>
                                            <span className="font-bold text-steel-900">
                                                {altura - 2} cm
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-steel-600">
                                                Largura:
                                            </span>
                                            <span className="font-bold text-steel-900">
                                                {comprimento} cm
                                            </span>
                                        </div>
                                    </div>
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
                                Atenção
                            </h4>
                            <p className="text-amber-800">
                                Verifique sempre as dimensões e quantidades
                                antes de iniciar a produção. As medidas devem
                                estar de acordo com o projeto estrutural.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultsDisplay;

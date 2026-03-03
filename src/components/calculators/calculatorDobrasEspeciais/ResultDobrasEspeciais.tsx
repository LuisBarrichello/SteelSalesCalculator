import { Layers, RefreshCw, Printer, AlertCircle } from 'lucide-react';
import { Button } from '../../common/buttons/Button';
import { BendingResult, PROFILE_LABELS } from './HandleCalculation';

interface Props {
    result: BendingResult;
    resetForm: () => void;
}

export default function ResultDobrasEspeciais({ result, resetForm }: Props) {
    const profileLabel = PROFILE_LABELS[result.profileType];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-green-600 to-emerald-700 px-6 py-8 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Layers className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Resultado do Cálculo
                            </h1>
                            <p className="text-green-100 mt-1">
                                Dobras Especiais — {profileLabel}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                    {/* Tabela de entrada */}
                    <div>
                        <h3 className="text-lg font-semibold text-steel-800 mb-3">
                            Dados do Perfil
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <InfoCard label="Tipo" value={profileLabel} />
                            <InfoCard
                                label="Espessura"
                                value={`${result.thickness} mm`}
                            />
                            <InfoCard
                                label="Comprimento"
                                value={`${result.length} m`}
                            />
                            <InfoCard
                                label="Quantidade"
                                value={`${result.quantity} barra(s)`}
                            />
                            {result.B !== undefined && (
                                <InfoCard
                                    label="Base (B)"
                                    value={`${result.B} mm`}
                                />
                            )}
                            {result.A !== undefined && (
                                <InfoCard
                                    label="Lado (A)"
                                    value={`${result.A} mm`}
                                />
                            )}
                            {result.a !== undefined && (
                                <InfoCard
                                    label="Flange (a)"
                                    value={`${result.a} mm`}
                                />
                            )}
                            {result.L1 !== undefined && (
                                <InfoCard
                                    label="Lado 1 (L1)"
                                    value={`${result.L1} mm`}
                                />
                            )}
                            {result.L2 !== undefined && (
                                <InfoCard
                                    label="Lado 2 (L2)"
                                    value={`${result.L2} mm`}
                                />
                            )}
                        </div>
                    </div>

                    {/* Tabela de resultado */}
                    <div>
                        <h3 className="text-lg font-semibold text-steel-800 mb-3">
                            Cálculo
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-steel-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                            Peso/m²
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                            Desconto
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                            Larg. Desenvolvida
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-steel-700">
                                            Peso/Barra
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-steel-700">
                                            Peso Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-steel-50 transition-colors">
                                        <td className="py-4 px-4 text-steel-900">
                                            {result.weightPerM2.toFixed(3)} kg/m²
                                        </td>
                                        <td className="py-4 px-4 text-steel-900">
                                            {result.discount.toFixed(2)} mm
                                        </td>
                                        <td className="py-4 px-4 text-steel-900">
                                            {result.developedWidth.toFixed(
                                                2,
                                            )}{' '}
                                            mm
                                        </td>
                                        <td className="py-4 px-4 text-steel-900">
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium">
                                                {result.unitWeight.toFixed(3)}{' '}
                                                kg
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="text-2xl font-bold text-indigo-600">
                                                {result.totalWeight.toFixed(2)} kg
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Destaque peso total */}
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-6 flex items-center justify-between">
                        <span className="text-steel-700 font-medium">
                            Peso Total ({result.quantity} barra
                            {result.quantity > 1 ? 's' : ''})
                        </span>
                        <span className="text-3xl font-bold text-indigo-700">
                            {result.totalWeight.toFixed(2)} kg
                        </span>
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col sm:flex-row gap-4">
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

            {/* Observações */}
            <div className="print:hidden space-y-4">
                <h3 className="text-xl font-bold text-steel-900">
                    Observações Importantes
                </h3>

                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-red-900 mb-1">
                                Peso máximo por peça
                            </h4>
                            <p className="text-red-800">
                                Peso máximo para dobra:{' '}
                                <strong>100 kg por peça.</strong> Dobras muito
                                largas, mesmo abaixo desse limite, devem ter
                                viabilidade de produção, transporte e preço
                                verificados.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-amber-900 mb-1">
                                Espessuras com sobras laterais
                            </h4>
                            <p className="text-amber-800">
                                Atenção para chapas{' '}
                                <strong>
                                    3,35 / 3,75 / 4,25 / 6,30 / 8,00 / 9,50 mm
                                </strong>
                                : mesmo com 6000 mm, verificar sobras laterais.
                                Venda sempre por quilo.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-1">
                                Formalização obrigatória
                            </h4>
                            <p className="text-blue-800">
                                Todo pedido requer{' '}
                                <strong>
                                    confirmação por escrito com desenho das
                                    peças
                                </strong>
                                . Comprimento máximo: 6 m. Espessura máxima:
                                3/8" (9,5 mm).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-steel-50 rounded-lg p-3 border border-steel-200">
            <p className="text-xs text-steel-500 mb-1">{label}</p>
            <p className="font-semibold text-steel-900 text-sm">{value}</p>
        </div>
    );
}

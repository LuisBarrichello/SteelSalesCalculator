import {
    AlertCircle,
    CheckCircle2,
    Download,
    FileText,
    Info,
    Loader2,
    Upload,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useRef, useState } from 'react';
import { Button } from '../common/buttons/Button';
import {
    exportCSV,
    parseERPReport,
    type ParseResult,
    type ReportFormat,
} from './utils/parseErpReport';

interface Props {
    onParsed: (result: ParseResult) => void;
}

const DELAY_COLORS = {
    ok: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    leve: 'bg-yellow-100  text-yellow-700  border-yellow-200',
    moderado: 'bg-orange-100  text-orange-700  border-orange-200',
    critico: 'bg-red-100     text-red-700     border-red-200',
} as const;

const FORMAT_LABELS: Record<ReportFormat, string> = {
    selecao: 'Relação de Pedidos por Rota',
    alternativa: 'Rota Alternativa',
    unknown: 'Formato não identificado',
};

// ── PDF text extraction ───────────────────────────────────────
// Bug fix: pdfjs returns items in content-stream order (not visual order).
// Must sort by position FIRST, then group by Y, then sort X within each line.

async function extractPdfText(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        // O Viewport normaliza as coordenadas reais da tela, resolvendo a rotação
        const viewport = page.getViewport({ scale: 1.0 });
        const content = await page.getTextContent();

        type PdfItem = { str: string; transform: number[] };
        const items = (content.items as PdfItem[]).filter((i) => i.str.trim());

        const positioned = items.map((i) => {
            // Usa a utilidade do PDF.js para mapear as matrizes de desenho para coordenadas de leitura
            const tx = pdfjsLib.Util.transform(viewport.transform, i.transform);
            return {
                x: tx[4],
                y: tx[5], // No viewport normalizado, Y=0 é o topo e cresce para baixo
                text: i.str,
            };
        });

        // Aumentamos a tolerância de 4px para 8px para lidar com desalinhamentos do ERP
        const buckets = new Map<number, typeof positioned>();
        for (const item of positioned) {
            let key = item.y;
            for (const k of buckets.keys()) {
                if (Math.abs(k - item.y) <= 8) {
                    key = k;
                    break;
                }
            }
            if (!buckets.has(key)) buckets.set(key, []);
            buckets.get(key)!.push(item);
        }

        // Ordena de cima para baixo (ya - yb) e da esquerda para direita (a.x - b.x)
        const lines = [...buckets.entries()]
            .sort(([ya], [yb]) => ya - yb)
            .map(([, lineItems]) =>
                lineItems
                    .sort((a, b) => a.x - b.x)
                    .map((i) => i.text)
                    .join(' ')
                    .replace(/\s{2,}/g, ' ') // Remove espaços bizarros gerados na extração
                    .trim(),
            )
            .filter(Boolean);

        pageTexts.push(lines.join('\n'));
    }

    return pageTexts.join('\n');
}

function downloadCSV(result: ParseResult) {
    const csv = exportCSV(result.orders);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
        href: url,
        download: `rotas_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
}

// ── Component ─────────────────────────────────────────────────

export default function ImportReport({ onParsed }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ParseResult | null>(null);
    const [fileName, setFileName] = useState('');
    const [dragOver, setDragOver] = useState(false);

    async function processFile(file: File) {
        if (!file.name.endsWith('.pdf')) return;
        setLoading(true);
        setFileName(file.name);
        try {
            const text = await extractPdfText(file);
            const parsed = parseERPReport(text);
            setResult(parsed);
            onParsed(parsed);
        } catch (err) {
            console.error('Error processing PDF:', err);
        } finally {
            setLoading(false);
        }
    }

    const totalWeight = result?.orders.reduce((s, o) => s + o.weight, 0) ?? 0;
    const totalDelayed =
        result?.orders.filter((o) => o.delayDays > 0).length ?? 0;
    const totalCities = result
        ? new Set(result.orders.map((o) => o.city)).size
        : 0;
    const totalPickup = result?.orders.filter((o) => o.pickup).length ?? 0;

    return (
        <div className="space-y-6">
            {/* Drop zone */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    processFile(e.dataTransfer.files[0]);
                }}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
                    transition-all duration-200
                    ${
                        dragOver
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-steel-300 hover:border-primary-400 hover:bg-steel-50'
                    }`}>
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) processFile(f);
                    }}
                />

                {loading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                        <p className="text-steel-600 font-medium">
                            Processando {fileName}…
                        </p>
                    </div>
                ) : result ? (
                    <div className="flex flex-col items-center gap-3">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        <p className="text-steel-700 font-medium">{fileName}</p>
                        <p className="text-sm text-steel-500">
                            Clique para importar outro PDF
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <Upload className="w-10 h-10 text-steel-400" />
                        <div>
                            <p className="text-steel-700 font-medium">
                                Arraste o PDF aqui ou clique para selecionar
                            </p>
                            <p className="text-sm text-steel-500 mt-1">
                                Relação de Pedidos por Rota ou Rota Alternativa
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {result && (
                <div className="space-y-4">
                    {/* Format badge */}
                    <div className="flex items-center gap-2 text-sm text-steel-600">
                        <Info className="w-4 h-4 text-sky-500" />
                        Formato detectado:
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold border
                            ${
                                result.format === 'unknown'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-sky-50 text-sky-700 border-sky-200'
                            }`}>
                            {FORMAT_LABELS[result.format]}
                        </span>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            {
                                label: 'Pedidos',
                                value: result.totalParsed,
                                cls: 'border-steel-200',
                            },
                            {
                                label: 'Cidades',
                                value: totalCities,
                                cls: 'border-steel-200',
                            },
                            {
                                label: 'Atrasados',
                                value: totalDelayed,
                                cls: 'border-red-200 bg-red-50',
                            },
                            {
                                label: 'Retira no balcão',
                                value: totalPickup,
                                cls: 'border-amber-200 bg-amber-50',
                            },
                            {
                                label: 'Peso total (kg)',
                                value: totalWeight.toLocaleString('pt-BR', {
                                    maximumFractionDigits: 0,
                                }),
                                cls: 'border-sky-200 bg-sky-50',
                            },
                        ].map((kpi) => (
                            <div
                                key={kpi.label}
                                className={`bg-white rounded-xl p-4 border-2 text-center ${kpi.cls}`}>
                                <p className="text-xs mb-1 opacity-60">
                                    {kpi.label}
                                </p>
                                <p className="text-2xl font-bold">
                                    {kpi.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Parse errors */}
                    {result.errors.length > 0 && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4">
                            <div className="flex gap-2 items-start">
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-amber-900">
                                        {result.errors.length} linha(s) não
                                        reconhecida(s)
                                    </p>
                                    <details className="mt-1">
                                        <summary className="text-xs text-amber-700 cursor-pointer select-none">
                                            Ver detalhes
                                        </summary>
                                        <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                                            {result.errors.map((e, i) => (
                                                <li
                                                    key={i}
                                                    className="text-xs font-mono text-amber-800 bg-amber-100 px-2 py-1 rounded truncate">
                                                    {e}
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview table */}
                    <div className="bg-white rounded-xl border-2 border-steel-200 overflow-hidden">
                        <div className="px-4 py-3 border-b border-steel-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-steel-500" />
                                <span className="text-sm font-semibold text-steel-700">
                                    Preview — primeiros 10 pedidos
                                </span>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                icon={<Download className="w-4 h-4" />}
                                onClick={() => downloadCSV(result)}>
                                Baixar CSV
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-steel-200 bg-steel-50">
                                        {[
                                            'Pedido',
                                            'Cliente',
                                            'Vendedor / Rota',
                                            'Cidade',
                                            'Nova Entrega',
                                            'Peso (kg)',
                                            'Sanduíche',
                                            'Atraso',
                                            'Status ERP',
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="text-left py-2 px-3 text-xs font-semibold text-steel-600 whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-steel-100">
                                    {result.orders.slice(0, 10).map((o) => (
                                        <tr
                                            key={`${o.order}-${o.customerCode}`}
                                            className="hover:bg-steel-50">
                                            <td className="py-2 px-3 font-mono text-xs text-steel-700">
                                                {o.order}
                                            </td>
                                            <td className="py-2 px-3 text-steel-900 max-w-40 truncate">
                                                {o.customer}
                                            </td>
                                            <td className="py-2 px-3 text-xs text-steel-500 whitespace-nowrap">
                                                {o.routeDescription ??
                                                    o.salesperson}
                                            </td>
                                            <td className="py-2 px-3 text-steel-700 whitespace-nowrap">
                                                {o.city}
                                            </td>
                                            <td className="py-2 px-3 text-xs text-steel-600 whitespace-nowrap">
                                                {o.newDelivery?.toLocaleDateString(
                                                    'pt-BR',
                                                ) ?? '—'}
                                            </td>
                                            <td className="py-2 px-3 text-right font-medium text-steel-800 whitespace-nowrap">
                                                {o.weight.toLocaleString(
                                                    'pt-BR',
                                                    {
                                                        maximumFractionDigits: 3,
                                                    },
                                                )}
                                            </td>
                                            <td className="py-2 px-3 text-center">
                                                {o.sandwich ? (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                                                        Sim
                                                    </span>
                                                ) : (
                                                    <span className="text-steel-300 text-xs">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2 px-3">
                                                {o.delayDays === 0 ? (
                                                    <span className="text-steel-300 text-xs">
                                                        —
                                                    </span>
                                                ) : (
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${DELAY_COLORS[o.delayStatus]}`}>
                                                        +{o.delayDays}d
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2 px-3">
                                                {o.erpStatus ? (
                                                    <span className="px-2 py-0.5 rounded bg-steel-100 text-steel-600 text-xs font-mono">
                                                        {o.erpStatus}
                                                    </span>
                                                ) : (
                                                    <span className="text-steel-300 text-xs">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {result.orders.length > 10 && (
                            <div className="px-4 py-2 text-xs text-steel-400 border-t border-steel-100 text-center">
                                + {result.orders.length - 10} pedidos adicionais
                                no CSV
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

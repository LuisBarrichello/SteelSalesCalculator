import { useRef, useState } from 'react';
import { Truck, X, Upload, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../../common/buttons/Button';
import type { VehicleType } from '../utils/parseErpReport';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    fleet: VehicleType[];
    onSave: (fleet: VehicleType[]) => void;
    onClear: () => void;
}

export function FleetModal({ isOpen, onClose, fleet, onSave, onClear }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim().length > 0);
                
                const newFleet: VehicleType[] = [];
                
                // Começa do índice 1 para pular o Cabeçalho do CSV
                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(';');
                    if (cols.length < 8) continue; // Pula linhas em branco ou curtas

                    const model = cols[1]?.trim();
                    const plate = cols[2]?.trim();
                    if (!model || !plate) continue;

                    const id = plate.replace(/\s+/g, '').toUpperCase();
                    const label = `${model} (${plate})`;
                    
                    // Transforma "9,60 MTS" em 9.60
                    const lengthStr = cols[5]?.replace(/[^\d,.-]/g, '').replace(',', '.');
                    const maxLengthM = parseFloat(lengthStr);

                    // Transforma "14.500 KG" em 14500
                    const capStr = cols[7]?.replace(/[^\d,-]/g, '');
                    const capacityKg = parseInt(capStr, 10);

                    if (id && !isNaN(maxLengthM) && !isNaN(capacityKg)) {
                        newFleet.push({ id, label, capacityKg, maxLengthM, count: 1 });
                    }
                }

                if (newFleet.length > 0) {
                    onSave(newFleet);
                    setError('');
                } else {
                    setError('Não foi possível encontrar dados válidos no CSV. Verifique o formato.');
                }
            } catch (err) {
                setError('Erro ao processar o arquivo CSV.');
                console.error(err);
            }
            // Limpa o input para permitir subir o mesmo arquivo de novo se errar
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        // Usa ISO-8859-1 porque o Excel no Brasil salva CSVs com essa codificação
        reader.readAsText(file, 'ISO-8859-1'); 
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-steel-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-steel-100 flex items-center justify-between bg-steel-50">
                    <h2 className="text-lg font-bold text-steel-800 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-sky-600" />
                        Configuração de Frota (CSV)
                    </h2>
                    <button onClick={onClose} className="text-steel-400 hover:text-steel-600"><X className="w-6 h-6" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    
                    <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 flex flex-col items-center justify-center text-center space-y-3">
                        <Upload className="w-8 h-8 text-sky-500" />
                        <div>
                            <h3 className="font-bold text-steel-800">Importar Planilha de Caminhões</h3>
                            <p className="text-sm text-steel-600 mt-1">Faça o upload do CSV gerado pelo Excel. As informações ficarão salvas apenas neste computador.</p>
                        </div>
                        <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                        <Button onClick={() => fileInputRef.current?.click()} variant="primary" className="mt-2">
                            Selecionar Arquivo .CSV
                        </Button>
                        {error && <p className="text-xs text-red-600 font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {error}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-steel-700">Frota Cadastrada no Sistema ({fleet.length} veículos)</h3>
                            {fleet.length > 0 && (
                                <button onClick={onClear} className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1">
                                    <Trash2 className="w-3 h-3" /> Limpar Frota
                                </button>
                            )}
                        </div>

                        {fleet.length === 0 ? (
                            <p className="text-sm text-steel-500 italic text-center py-6 bg-steel-50 rounded-lg border border-dashed border-steel-200">
                                Nenhum veículo cadastrado. O sistema não conseguirá validar pesos e volumes.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {fleet.map(v => (
                                    <div key={v.id} className="flex flex-col p-2.5 border border-steel-200 rounded-lg bg-white shadow-sm">
                                        <span className="font-bold text-steel-800 text-sm">{v.label}</span>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-steel-500 font-medium">
                                            <span>Cap: {(v.capacityKg/1000).toFixed(1)}t</span>
                                            <span>Comp: {v.maxLengthM}m</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
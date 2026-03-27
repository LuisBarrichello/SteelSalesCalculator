import { useState } from 'react';
import { ShieldAlert, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../common/buttons/Button';
import type { CustomerRestriction, RestrictionsMap } from '../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    restrictions: RestrictionsMap;
    onSave: (form: CustomerRestriction) => void;
    onDelete: (code: string) => void;
}

export function RestrictionModal({
    isOpen,
    onClose,
    restrictions,
    onSave,
    onDelete,
}: Props) {
    const [form, setForm] = useState<CustomerRestriction>({
        code: '',
        name: '',
        blockCarreta: false,
        timeWindow: '',
        needsMunck: false,
        notes: '',
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-steel-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-steel-100 flex items-center justify-between bg-steel-50">
                    <h2 className="text-lg font-bold text-steel-800 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-sky-600" />
                        Regras e Restrições de Clientes
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-steel-400 hover:text-steel-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 space-y-3">
                        <h3 className="text-sm font-semibold text-sky-800">
                            Adicionar Nova Restrição
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                placeholder="Cód. Cliente (ex: 033658)"
                                value={form.code}
                                onChange={(e) =>
                                    setForm({ ...form, code: e.target.value })
                                }
                                className="px-3 py-2 rounded-lg border border-steel-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                            <input
                                placeholder="Nome (Opcional)"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                className="px-3 py-2 rounded-lg border border-steel-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                placeholder="Janela (ex: Só de Manhã)"
                                value={form.timeWindow}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        timeWindow: e.target.value,
                                    })
                                }
                                className="px-3 py-2 rounded-lg border border-steel-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                            <input
                                placeholder="Observações (ex: Rua sem saída)"
                                value={form.notes}
                                onChange={(e) =>
                                    setForm({ ...form, notes: e.target.value })
                                }
                                className="px-3 py-2 rounded-lg border border-steel-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-steel-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.blockCarreta}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                blockCarreta: e.target.checked,
                                            })
                                        }
                                        className="rounded text-sky-600"
                                    />{' '}
                                    Proibir Carreta
                                </label>
                                <label className="flex items-center gap-2 text-sm text-steel-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.needsMunck}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                needsMunck: e.target.checked,
                                            })
                                        }
                                        className="rounded text-sky-600"
                                    />{' '}
                                    Requer Munck
                                </label>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => {
                                    onSave(form);
                                    setForm({
                                        code: '',
                                        name: '',
                                        blockCarreta: false,
                                        timeWindow: '',
                                        needsMunck: false,
                                        notes: '',
                                    });
                                }}
                                icon={<Plus className="w-4 h-4" />}>
                                Adicionar
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-steel-700 mb-3">
                            Restrições Cadastradas (
                            {Object.keys(restrictions).length})
                        </h3>
                        {Object.keys(restrictions).length === 0 ? (
                            <p className="text-sm text-steel-500 italic text-center py-4">
                                Nenhuma restrição configurada.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {Object.values(restrictions).map((r) => (
                                    <div
                                        key={r.code}
                                        className="flex items-center justify-between p-3 border border-steel-200 rounded-lg hover:border-sky-200 bg-white">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold bg-steel-100 px-1.5 py-0.5 rounded">
                                                    {r.code}
                                                </span>
                                                <span className="text-sm font-semibold text-steel-800">
                                                    {r.name ||
                                                        'Cliente Sem Nome'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 mt-1 flex-wrap">
                                                {r.blockCarreta && (
                                                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 rounded font-bold">
                                                        SEM CARRETA
                                                    </span>
                                                )}
                                                {r.needsMunck && (
                                                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 rounded font-bold">
                                                        REQUER MUNCK
                                                    </span>
                                                )}
                                                {r.timeWindow && (
                                                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 rounded">
                                                        ⏰ {r.timeWindow}
                                                    </span>
                                                )}
                                                {r.notes && (
                                                    <span className="text-[10px] text-steel-500 italic">
                                                        "{r.notes}"
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onDelete(r.code)}
                                            className="p-2 text-steel-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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

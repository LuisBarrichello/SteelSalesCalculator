import { Layers } from 'lucide-react';
import { FormInput } from '../../common/forms/FormInput';
import { Button } from '../../common/buttons/Button';
import {
    BendingFormData,
    ProfileType,
    PROFILE_LABELS,
    THICKNESSES,
} from './HandleCalculation';

interface Props {
    formData: BendingFormData;
    setFormData: React.Dispatch<React.SetStateAction<BendingFormData>>;
    onSubmit: () => void;
}

/* ── Diagramas SVG dos perfis ────────────────────────────────── */
const UDCSvg = () => (
    <svg viewBox="0 0 100 80" className="w-20 h-16 mx-auto">
        <polyline
            points="15,10 15,70 85,70 85,10"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <text x="2" y="44" fontSize="11" fill="currentColor" fontWeight="600">
            A
        </text>
        <text x="44" y="80" fontSize="11" fill="currentColor" fontWeight="600">
            B
        </text>
        <text x="88" y="44" fontSize="11" fill="currentColor" fontWeight="600">
            A
        </text>
    </svg>
);

const EnrijecidoSvg = () => (
    <svg viewBox="0 0 120 80" className="w-20 h-16 mx-auto">
        {/* C-channel com flanges externos */}
        <polyline
            points="35,10 15,10 15,70 105,70 105,10 85,10"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <text x="2" y="44" fontSize="10" fill="currentColor" fontWeight="600">
            A
        </text>
        <text x="55" y="80" fontSize="10" fill="currentColor" fontWeight="600">
            B
        </text>
        <text x="107" y="44" fontSize="10" fill="currentColor" fontWeight="600">
            A
        </text>
        <text x="18" y="8" fontSize="9" fill="currentColor">
            a
        </text>
        <text x="88" y="8" fontSize="9" fill="currentColor">
            a
        </text>
    </svg>
);

const CartolaSvg = () => (
    <svg viewBox="0 0 120 90" className="w-20 h-16 mx-auto">
        {/* Top hat: flanges internos no topo */}
        <polyline
            points="5,80 35,80 35,10 85,10 85,80 115,80"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <text x="55" y="8" fontSize="10" fill="currentColor" fontWeight="600">
            B
        </text>
        <text x="18" y="50" fontSize="10" fill="currentColor" fontWeight="600">
            A
        </text>
        <text x="88" y="50" fontSize="10" fill="currentColor" fontWeight="600">
            A
        </text>
        <text x="10" y="88" fontSize="9" fill="currentColor">
            a
        </text>
        <text x="99" y="88" fontSize="9" fill="currentColor">
            a
        </text>
    </svg>
);

const LSvg = () => (
    <svg viewBox="0 0 80 80" className="w-20 h-16 mx-auto">
        <polyline
            points="20,10 20,70 80,70"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <text x="2" y="44" fontSize="11" fill="currentColor" fontWeight="600">
            L1
        </text>
        <text x="46" y="82" fontSize="11" fill="currentColor" fontWeight="600">
            L2
        </text>
    </svg>
);

const PROFILE_ICONS: Record<ProfileType, React.FC> = {
    udc: UDCSvg,
    enrijecido: EnrijecidoSvg,
    cartola: CartolaSvg,
    l: LSvg,
};

/* ─────────────────────────────────────────────────────────────── */
export default function FormCalculatorDobrasEspeciais({
    formData,
    setFormData,
    onSubmit,
}: Props) {
    const set = (field: keyof BendingFormData, value: string | number) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const isL = formData.profileType === 'l';
    const hasSa =
        formData.profileType === 'enrijecido' ||
        formData.profileType === 'cartola';

    const canSubmit = () => {
        if (formData.length <= 0 || formData.quantity <= 0) return false;
        if (isL) return formData.L1 > 0 && formData.L2 > 0;
        if (hasSa) return formData.B > 0 && formData.A > 0 && formData.a > 0;
        return formData.B > 0 && formData.A > 0;
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-indigo-600 to-violet-700 px-6 py-8 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Dobras Especiais
                        </h1>
                        <p className="text-indigo-100 mt-1">
                            Cálculo de peso de perfis dobrados em chapa de aço
                        </p>
                    </div>
                </div>
            </div>

            <form
                className="p-6 sm:p-8 space-y-8"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (canSubmit()) onSubmit();
                }}>
                {/* Seleção do perfil */}
                <div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                        Tipo de Perfil
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(Object.keys(PROFILE_LABELS) as ProfileType[]).map(
                            (type) => {
                                const Svg = PROFILE_ICONS[type];
                                const active = formData.profileType === type;
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                profileType: type,
                                                B: 0,
                                                A: 0,
                                                a: 0,
                                                L1: 0,
                                                L2: 0,
                                            }))
                                        }
                                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                                            active
                                                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                                : 'border-steel-200 hover:border-indigo-300 hover:bg-steel-50'
                                        }`}>
                                        <span
                                            className={
                                                active
                                                    ? 'text-indigo-600'
                                                    : 'text-steel-400'
                                            }>
                                            <Svg />
                                        </span>
                                        <span
                                            className={`mt-2 block text-xs font-semibold ${
                                                active
                                                    ? 'text-indigo-700'
                                                    : 'text-steel-600'
                                            }`}>
                                            {PROFILE_LABELS[type]}
                                        </span>
                                    </button>
                                );
                            },
                        )}
                    </div>
                </div>

                {/* Espessura + comprimento + quantidade */}
                <div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                        Parâmetros Gerais
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <FormInput
                            label="Espessura da Chapa (mm)"
                            type="select"
                            value={formData.thickness}
                            onChange={(v) => set('thickness', Number(v))}
                            required>
                            {THICKNESSES.map((t) => (
                                <option key={t} value={t}>
                                    {t.toFixed(2)} mm
                                </option>
                            ))}
                        </FormInput>
                        <FormInput
                            label="Comprimento da Barra (m)"
                            type="number"
                            value={formData.length || ''}
                            onChange={(v) => set('length', Number(v))}
                            min={0.1}
                            step="0.01"
                            error={formData.length > 6}
                            errorMessage="Comprimento máximo: 6 metros"
                            required
                        />
                        <FormInput
                            label="Quantidade de Barras"
                            type="number"
                            value={formData.quantity || ''}
                            onChange={(v) => set('quantity', Number(v))}
                            min={1}
                            error={formData.quantity <= 0}
                            errorMessage="Deve ser maior que zero"
                            required
                        />
                    </div>
                </div>

                {/* Dimensões dinâmicas */}
                <div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                        Dimensões do Perfil (mm)
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {isL ? (
                            <>
                                <FormInput
                                    label="Lado 1 — L1 (mm)"
                                    type="number"
                                    value={formData.L1 || ''}
                                    onChange={(v) => set('L1', Number(v))}
                                    min={1}
                                    required
                                />
                                <FormInput
                                    label="Lado 2 — L2 (mm)"
                                    type="number"
                                    value={formData.L2 || ''}
                                    onChange={(v) => set('L2', Number(v))}
                                    min={1}
                                    required
                                />
                            </>
                        ) : (
                            <>
                                <FormInput
                                    label="Base — B (mm)"
                                    type="number"
                                    value={formData.B || ''}
                                    onChange={(v) => set('B', Number(v))}
                                    min={1}
                                    required
                                />
                                <FormInput
                                    label="Altura dos Lados — A (mm)"
                                    type="number"
                                    value={formData.A || ''}
                                    onChange={(v) => set('A', Number(v))}
                                    min={1}
                                    required
                                />
                                {hasSa && (
                                    <FormInput
                                        label="Flange — a (mm)"
                                        type="number"
                                        value={formData.a || ''}
                                        onChange={(v) => set('a', Number(v))}
                                        min={1}
                                        required
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Resumo da fórmula */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800">
                    {formData.profileType === 'udc' && (
                        <p>
                            <strong>Fórmula:</strong> (B + A + A − 4×esp) ×
                            PESO/m² × comprimento ÷ 1000
                        </p>
                    )}
                    {formData.profileType === 'enrijecido' && (
                        <p>
                            <strong>Fórmula:</strong> (B + A + A + a + a −
                            8×esp) × PESO/m² × comprimento ÷ 1000
                        </p>
                    )}
                    {formData.profileType === 'cartola' && (
                        <p>
                            <strong>Fórmula:</strong> (B + A + A + a + a −
                            6×esp) × PESO/m² × comprimento ÷ 1000
                        </p>
                    )}
                    {formData.profileType === 'l' && (
                        <p>
                            <strong>Fórmula:</strong> (L1 + L2 − 2×esp) ×
                            PESO/m² × comprimento ÷ 1000
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={!canSubmit()}
                        icon={<Layers className="w-5 h-5" />}>
                        Calcular Peso
                    </Button>
                </div>
            </form>
        </div>
    );
}

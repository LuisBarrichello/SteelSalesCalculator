import { FormEvent } from 'react';
import { Grid3x3, Calculator } from 'lucide-react';
import { FormInput } from '../../common/forms/FormInput';
import { Button } from '../../common/buttons/Button';

interface FormCalculatorSapatasProps {
    largura: number;
    setLargura: (value: number) => void;
    comprimento: number;
    setComprimento: (value: number) => void;
    altura: number;
    setAltura: (value: number) => void;
    quantidadeDeFerros: number;
    setQuantidadeDeFerros: (value: number) => void;
    quantidadeDeSapatas: number;
    setQuantidadeDeSapatas: (value: number) => void;
    bitola: string;
    setBitola: (value: string) => void;
    handleSubmit: (event: FormEvent) => void;
}

function FormCalculatorSapatas({
    largura,
    setLargura,
    comprimento,
    setComprimento,
    altura,
    setAltura,
    quantidadeDeFerros,
    setQuantidadeDeFerros,
    quantidadeDeSapatas,
    setQuantidadeDeSapatas,
    bitola,
    setBitola,
    handleSubmit,
}: FormCalculatorSapatasProps) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-8 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <Grid3x3 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Cálculo de Sapatas
                        </h1>
                        <p className="text-violet-100 mt-1">
                            Dimensionamento de sapatas e estribos
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-violet-500 rounded-full"></div>
                        Dimensões da Sapata
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <FormInput
                            label="Largura (cm)"
                            type="number"
                            value={largura}
                            onChange={(value) => setLargura(Number(value))}
                            min={1}
                            error={largura <= 0}
                            errorMessage="Deve ser maior que zero"
                            required
                        />
                        <FormInput
                            label="Comprimento (cm)"
                            type="number"
                            value={comprimento}
                            onChange={(value) => setComprimento(Number(value))}
                            min={1}
                            error={comprimento <= 0}
                            errorMessage="Deve ser maior que zero"
                            required
                        />
                        <FormInput
                            label="Altura (cm)"
                            type="number"
                            value={altura}
                            onChange={(value) => setAltura(Number(value))}
                            min={1}
                            error={altura <= 0}
                            errorMessage="Deve ser maior que zero"
                            required
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-steel-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-violet-500 rounded-full"></div>
                        Quantidades
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <FormInput
                            label="Quantidade de Sapatas"
                            type="number"
                            value={quantidadeDeSapatas}
                            onChange={(value) =>
                                setQuantidadeDeSapatas(Number(value))
                            }
                            min={1}
                            error={quantidadeDeSapatas <= 0}
                            errorMessage="Deve ser maior que zero"
                            required
                        />
                        <FormInput
                            label="Ferros por Sapata"
                            type="number"
                            value={quantidadeDeFerros}
                            onChange={(value) =>
                                setQuantidadeDeFerros(Number(value))
                            }
                            min={1}
                            error={quantidadeDeFerros <= 0}
                            errorMessage="Deve ser maior que zero"
                            required
                        />
                        <FormInput
                            label="Bitola (mm)"
                            type="select"
                            value={bitola}
                            onChange={(value) => setBitola(value)}
                            required>
                            <option value="4.2">4.2 mm</option>
                            <option value="5">5.0 mm</option>
                            <option value="6.3">6.3 mm</option>
                            <option value="8">8.0 mm</option>
                            <option value="10">10.0 mm</option>
                            <option value="12.5">12.5 mm</option>
                            <option value="16">16.0 mm</option>
                            <option value="20">20.0 mm</option>
                        </FormInput>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                            <span className="text-sm font-medium text-violet-900">
                                Estribos por Sapata
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-violet-700">
                            {quantidadeDeFerros > 0 ? quantidadeDeFerros : '--'}
                        </p>
                    </div>
                    <div className="bg-violet-50 rounded-lg p-4 border border-violet-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                            <span className="text-sm font-medium text-violet-900">
                                Total de Estribos
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-violet-700">
                            {quantidadeDeFerros > 0 && quantidadeDeSapatas > 0
                                ? quantidadeDeFerros * quantidadeDeSapatas
                                : '--'}
                        </p>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={<Calculator className="w-5 h-5" />}>
                        Calcular Sapatas
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default FormCalculatorSapatas;

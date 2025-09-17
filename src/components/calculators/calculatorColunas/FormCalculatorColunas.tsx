import { useForm, SubmitHandler } from 'react-hook-form';

interface dataColunas {
    numberOfColumns: number;
    numberOfIronBars: number;
    stirrupSpacing: number;
    gaugeIronBars: number;
    metersOfColumns: number;
    metersHaveStirrup: number;
    numberOfStirrupsPerColumns: number;
    stirrupMeasurements: {
        shape: ShapeEnum;
        gauge: number;
        lengthSides: {
            length1?: number;
            length2?: number;
            radius?: number;
        };
    };
}

enum ShapeEnum {
    square = 'square',
    rectangular = 'rectangular',
    triangular = 'triangular',
    circular = 'circular',
}

interface FormCalculatorColunasProps {
    onSubmit: (data: dataColunas) => void;
}

const FormCalculatorColunas = ({ onSubmit }: FormCalculatorColunasProps) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<dataColunas>();

    const shapeValue = watch('stirrupMeasurements.shape');

    const handleFormSubmit: SubmitHandler<dataColunas> = (data) => {
        onSubmit(data);
    };

    return (
        <>
            <section className="container min-height">
                <h1 className="mb-4 mt-4 text-center">Cálculo de Colunas</h1>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="form-floating mb-3 mt-3">
                        <input
                            type="number"
                            className={`form-control ${
                                errors.numberOfColumns ? 'is-invalid' : ''
                            }`}
                            {...register('numberOfColumns', {
                                required: true,
                                min: 1,
                            })}></input>
                        <label htmlFor="">Qual quantidade de colunas?</label>
                        {errors.numberOfColumns && (
                            <div className="invalid-feedback">
                                Campo obrigatório e deve ser maior que 0
                            </div>
                        )}
                    </div>

                    <div className="form-floating mb-3 mt-3">
                        <input
                            type="number"
                            className={`form-control ${
                                errors.numberOfIronBars ? 'is-invalid' : ''
                            }`}
                            {...register('numberOfIronBars', {
                                required: true,
                                min: 3,
                            })}></input>
                        <label htmlFor="">
                            Qual quantidade de ferros por colunas?
                        </label>
                        {errors.numberOfIronBars && (
                            <div className="invalid-feedback">
                                Campo obrigatório e deve ser maior que 2
                            </div>
                        )}
                    </div>

                    <div className="form-floating mb-3 mt-3">
                        <input
                            type="number"
                            step="0.01"
                            className={`form-control ${
                                errors.metersOfColumns ? 'is-invalid' : ''
                            }`}
                            {...register('metersOfColumns', {
                                required: true,
                                min: 0.01,
                            })}></input>
                        <label htmlFor="metersOfColumns">
                            Qual tamanho em metros das colunas?
                        </label>
                        {errors.metersOfColumns && (
                            <div className="invalid-feedback">
                                Campo obrigatório e deve ser maior que 0
                            </div>
                        )}
                    </div>

                    <div className="form-floating mb-3 mt-3">
                        <input
                            type="number"
                            step="0.01"
                            className={`form-control ${
                                errors.metersHaveStirrup ? 'is-invalid' : ''
                            }`}
                            {...register('metersHaveStirrup', {
                                required: true,
                                min: 1,
                            })}></input>
                        <label htmlFor="metersHaveStirrup">
                            Qual metragem das colunas que irá ter estribos?
                        </label>
                        {errors.metersHaveStirrup && (
                            <div className="invalid-feedback">
                                Campo obrigatório e deve ser maior que 0
                            </div>
                        )}
                    </div>

                    <div className="form-floating mb-3 mt-3">
                        <select
                            className={`form-select ${
                                errors.gaugeIronBars ? 'is-invalid' : ''
                            }`}
                            {...register('gaugeIronBars', { required: true })}>
                            <option value="4.2">4.2</option>
                            <option value="5">5</option>
                            <option value="6.3">6.3</option>
                            <option value="8">8</option>
                            <option value="10">10</option>
                            <option value="12.5">12.5</option>
                            <option value="16">16</option>
                            <option value="20">20</option>
                        </select>
                        <label htmlFor="gauge">
                            Qual a bitola dos ferros {}?
                        </label>
                        {errors.gaugeIronBars && (
                            <div className="invalid-feedback">
                                Campo obrigatório
                            </div>
                        )}
                    </div>

                    <div className="form-floating mb-3 mt-3">
                        <input
                            type="number"
                            className={`form-control ${
                                errors.stirrupSpacing ? 'is-invalid' : ''
                            }`}
                            {...register('stirrupSpacing', {
                                required: true,
                                min: 1,
                            })}></input>
                        <label htmlFor="stirrupSpacing">
                            Qual espaçamento dos estribos? (em centímetros)
                        </label>
                        {errors.stirrupSpacing && (
                            <div className="invalid-feedback">
                                Campo obrigatório e deve ser maior que 0
                            </div>
                        )}
                    </div>

                    <div className="form-floating mb-3 mt-3">
                        <select
                            className={`form-select ${
                                errors.stirrupMeasurements?.shape
                                    ? 'is-invalid'
                                    : ''
                            }`}
                            {...register('stirrupMeasurements.shape', {
                                required: true,
                            })}>
                            <option value="square">Quadrado</option>
                            <option value="rectangular">Retangular</option>
                            <option value="triangular">Triangular</option>
                            <option value="circular">Circular</option>
                        </select>
                        <label htmlFor="">Qual shape dos estribos?</label>
                        {errors.stirrupMeasurements?.shape && (
                            <div className="invalid-feedback">
                                Campo obrigatório
                            </div>
                        )}
                    </div>

                    {shapeValue === 'rectangular' ? (
                        <>
                            <div className="form-floating mb-3 mt-3">
                                <input
                                    type="number"
                                    step="0.1"
                                    className={`form-control ${
                                        errors.stirrupMeasurements?.lengthSides
                                            ?.length1
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                    {...register(
                                        'stirrupMeasurements.lengthSides.length1',
                                        {
                                            required: true,
                                            min: 1,
                                        },
                                    )}></input>
                                <label htmlFor="">
                                    Qual tamanho do primeiro lado dos estribos?
                                    (em centímetros)
                                </label>
                                {errors.stirrupMeasurements?.lengthSides
                                    ?.length1 && (
                                    <div className="invalid-feedback">
                                        Campo obrigatório e deve ser maior que 0
                                    </div>
                                )}
                            </div>
                            <div className="form-floating mb-3 mt-3">
                                <input
                                    type="number"
                                    step="0.1"
                                    className={`form-control ${
                                        errors.stirrupMeasurements?.lengthSides
                                            ?.length2
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                    {...register(
                                        'stirrupMeasurements.lengthSides.length2',
                                        {
                                            required: true,
                                            min: 1,
                                        },
                                    )}></input>
                                <label htmlFor="">
                                    Qual tamanho do segundo lado dos estribos?
                                    (em centímetros)
                                </label>
                                {errors.stirrupMeasurements?.lengthSides
                                    ?.length2 && (
                                    <div className="invalid-feedback">
                                        Campo obrigatório e deve ser maior que 0
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-floating mb-3 mt-3">
                                {shapeValue === 'circular' ? (
                                    <>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className={`form-control ${
                                                errors.stirrupMeasurements
                                                    ?.lengthSides?.radius
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            {...register(
                                                'stirrupMeasurements.lengthSides.radius',
                                                {
                                                    required: true,
                                                    min: 1,
                                                },
                                            )}></input>
                                        <label htmlFor="">
                                            Qual o raio dos estribos? (em
                                            centímetros)
                                        </label>
                                        {errors.stirrupMeasurements?.lengthSides
                                            ?.radius && (
                                            <div className="invalid-feedback">
                                                Campo obrigatório e deve ser
                                                maior que 0
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className={`form-control ${
                                                errors.stirrupMeasurements
                                                    ?.lengthSides?.length1
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            {...register(
                                                'stirrupMeasurements.lengthSides.length1',
                                                {
                                                    required: true,
                                                    min: 1,
                                                },
                                            )}></input>
                                        <label htmlFor="">
                                            Qual tamanho dos estribos? (em
                                            centímetros)
                                        </label>
                                        {errors.stirrupMeasurements?.lengthSides
                                            ?.length1 && (
                                            <div className="invalid-feedback">
                                                Campo obrigatório e deve ser
                                                maior que 0
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    <div className="form-floating mb-3 mt-3">
                        <select
                            className={`form-select ${
                                errors.stirrupMeasurements?.gauge
                                    ? 'is-invalid'
                                    : ''
                            }`}
                            {...register('stirrupMeasurements.gauge', {
                                required: true,
                            })}>
                            <option value="4.2">4.2</option>
                            <option value="5">5</option>
                            <option value="6.3">6.3</option>
                            <option value="8">8</option>
                            <option value="10">10</option>
                            <option value="12.5">12.5</option>
                            <option value="16">16</option>
                            <option value="20">20</option>
                        </select>
                        <label htmlFor="gauge">
                            Qual a bitola dos estribos?
                        </label>
                        {errors.stirrupMeasurements?.gauge && (
                            <div className="invalid-feedback">
                                Campo obrigatório
                            </div>
                        )}
                    </div>

                    <button className="btn btn-primary mb-4" type="submit">
                        Calcular
                    </button>
                </form>
            </section>
        </>
    );
};

export default FormCalculatorColunas;

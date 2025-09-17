import { DataResultColunasInterface } from "./CalculatorColunas";
import ImgColuna from "../../../assets/img/coluna.png";
import CardImportantNoteEstribos from "../../common/cards/CardImportantNoteEstribos";

interface Props {
  result: DataResultColunasInterface;
  resetForm: () => void;
}

const ResultsDisplay = ({ result, resetForm }: Props) => {
  const shape = result.stirrupMeasurements?.shape;
  const radius = result.stirrupMeasurements?.lengthSides?.radius ?? 0;

  return (
      <>
          <div className="container text-center mt-3">
              <h1>Resutado do cálculo</h1>
          </div>
          <div className="table-responsive">
              <h3 className="text-center">Colunas e barras</h3>
              <table className="table table-hover mt-3 mb-5 container">
                  <thead>
                      <tr>
                          <th>Total de colunas</th>
                          <th>Tamanho das colunas</th>
                          <th>Barras por colunas</th>
                          <th>Total de barras</th>
                          <th>Ø das barras</th>
                          <th>Peso das barras</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>{result.numberOfColumns}</td>
                          <td>{result.metersOfColumns} metros </td>
                          <td>{result.numberOfIronBars}</td>
                          <td>{result.totalNumberOfBars}</td>
                          <td>{result.gaugeIronBars}mm</td>
                          <td>{result.totalWeightOfBars?.toFixed(2)} kg</td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <div className="table-responsive">
              <h3 className="text-center">Estribos</h3>
              <table className="table table-hover mt-3 mb-5 container">
                  <thead>
                      <tr>
                          {shape !== 'circular' && <th>Dimensões</th>}
                          <th>Etribos por coluna</th>
                          <th>Total de estribos</th>
                          <th>Ø dos estribos</th>
                          {result.stirrupMeasurements?.shape === 'circular' ? (
                              <th>Diametro</th>
                          ) : (
                              ''
                          )}
                          <th>Espaçamento entre os estribos</th>
                          <th>Peso dos estribos</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          {shape === 'rectangular' && (
                              <td>
                                  {
                                      result.stirrupMeasurements?.lengthSides
                                          ?.length1
                                  }{' '}
                                  x{' '}
                                  {
                                      result.stirrupMeasurements?.lengthSides
                                          ?.length2
                                  }
                              </td>
                          )}
                          {shape === 'triangular' && (
                              <td>
                                  {
                                      result.stirrupMeasurements?.lengthSides
                                          ?.length1
                                  }{' '}
                                  x{' '}
                                  {
                                      result.stirrupMeasurements?.lengthSides
                                          ?.length1
                                  }{' '}
                                  x{' '}
                                  {
                                      result.stirrupMeasurements?.lengthSides
                                          ?.length1
                                  }
                              </td>
                          )}

                          {shape === 'square' && (
                              <td>
                                  {
                                      result.stirrupMeasurements?.lengthSides
                                          ?.length1
                                  }{' '}
                                  x{' '}
                                  {
                                      result.stirrupMeasurements?.lengthSides
                                          ?.length1
                                  }
                              </td>
                          )}
                          <td>{result.numberOfStirrupsPerColumns}</td>
                          <td>{result.totalNumberOfStirrups}</td>
                          <td>{result.stirrupMeasurements?.gauge}mm</td>
                          {shape === 'circular' ? (
                              <td>{`${radius * 2} cm`}</td>
                          ) : (
                              ''
                          )}
                          <td>{result.stirrupSpacing}cm</td>
                          <td>{result.totalWeightOfStirrups?.toFixed(2)} kg</td>
                      </tr>
                  </tbody>
              </table>
          </div>
          <div className="mb-2 w-100 d-flex justify-content-center align-items-center gap-5">
              <button className="btn btn-primary" onClick={() => resetForm()}>
                  Refazer Cálculo
              </button>
              <button className="btn btn-dark" onClick={() => window.print()}>
                  Imprimir
              </button>
          </div>

          <div className="mb-4 container d-flex justify-content-center align-items-center container-estribo-responsive no-print">
              <div className="no-print w-25">
                  <img src={ImgColuna} alt="" className="img-fluid" />
              </div>
              <div className="no-print">
                  <h4>Obervação Importantes</h4>
                  <CardImportantNoteEstribos></CardImportantNoteEstribos>
              </div>
          </div>
      </>
  );
};

export default ResultsDisplay;

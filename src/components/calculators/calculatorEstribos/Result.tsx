import { ResultInterface } from "./CalculatorEstribos";
import ImgEstriboCircular from "../../../assets/img/estribo-circular.png";
import ImgEstriboTriangular from "../../../assets/img/estribo-triangular.png";
import ImgEstriboDefault from "../../../assets/img/estribo.png";
import "../../../assets/css/calculatorResponsive.css";
import CardImportantNoteEstribos from "../../common/cards/CardImportantNoteEstribos";

interface ResultProps {
  result: ResultInterface;
  resetForm: () => void;
}

interface ComponentesPorShape {
  [key: string]: () => JSX.Element;
}

const EstriboCircular = () => (
  <img
    src={ImgEstriboCircular}
    alt="estribo circular"
    style={{ maxWidth: "250px" }}
  />
);
const EstriboTriangular = () => (
  <img
    src={ImgEstriboTriangular}
    alt="estribo triangular"
    style={{ maxWidth: "250px" }}
  />
);
const EstriboDefault = () => (
  <img
    src={ImgEstriboDefault}
    alt="estribo retangular ou quadrado"
    style={{ maxWidth: "250px" }}
  />
);

const componentePorShape: ComponentesPorShape = {
  circular: EstriboCircular,
  triangular: EstriboTriangular,
};

function Result({ result, resetForm }: ResultProps) {
  const imageEstribo = componentePorShape[result.shape] || EstriboDefault;

  return (
    <>
      <div className="container text-center mt-3">
        <h1>Resutado do cálculo</h1>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mt-3 mb-5 container">
          <thead>
            <tr>
              <th>#</th>
              <th>Quantidade de estribos</th>
              {result.shape === "circular" ? <th>Diametro</th> : ""}
              <th>Bitola</th>
              <th>Peso</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{result.quantityTotal}</td>
              {result.shape === "circular" ? (
                <td>{result.lengthSides[0] * 2}</td>
              ) : (
                ""
              )}
              <td>{result.gauge}mm</td>
              <td>{result.weight} Kg</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-4 w-100 d-flex justify-content-center align-items-center gap-5">
        <button className="btn btn-primary" onClick={() => resetForm()}>
          Refazer Cálculo
        </button>
        <button className="btn btn-dark" onClick={() => window.print()}>
          Imprimir
        </button>
      </div>
      <section className="mb-4 container d-flex justify-content-center align-items-center container-estribo-responsive">
        <div className="w-100 d-flex justify-content-center flex-column align-items-center">
          <h4 className="mb-2">Resultado</h4>
          <div className="d-flex justify-content-center align-items-center">
            <span>{result.lengthSides[0]}</span>
            <figure>{imageEstribo()}</figure>
          </div>
          <span>{result.lengthSides[1]}</span>
        </div>
        <div>
          <h4>Obervação Importantes</h4>
          <CardImportantNoteEstribos></CardImportantNoteEstribos>
        </div>
      </section>
      <section className="container"></section>
    </>
  );
}

export default Result;

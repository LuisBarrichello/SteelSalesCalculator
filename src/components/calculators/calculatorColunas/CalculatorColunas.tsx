import { useState } from "react";
import Footer from "../../common/Footer";
import Header from "../../common/Header";
import FormCalculatorColunas from "./FormCalculatorColunas";
import {
  calculatesNumberOfStirrupsPerColumns,
  calculatesTotalNumberOfBars,
  calculatesTotalNumberOfStirrups,
  calculatesTotalWeightOfBars,
  calculatesTotalWeightOfStirrups,
} from "./HandleCalculation";
import ResultsDisplay from "./ResultsDisplay";

export interface DataResultColunasInterface {
  numberOfColumns?: number;
  numberOfIronBars?: number;
  stirrupSpacing?: number;
  gaugeIronBars?: number;
  metersOfColumns?: number;
  metersHaveStirrup?: number;
  stirrupMeasurements?: {
    shape?: string;
    gauge?: number;
    lengthSides?: {
      length1?: number;
      length2?: number;
      radius?: number;
    };
  };
  totalNumberOfBars?: number;
  totalWeightOfBars?: number;
  totalNumberOfStirrups?: number;
  totalWeightOfStirrups?: number;
  numberOfStirrupsPerColumns: number;
}

function CalculatorColunas() {
  const [result, setResult] = useState<DataResultColunasInterface>({
    numberOfColumns: 0,
    numberOfIronBars: 0,
    stirrupSpacing: 0,
    gaugeIronBars: 0,
    metersOfColumns: 0,
    metersHaveStirrup: 0,
    stirrupMeasurements: {
      shape: "",
      gauge: 0,
      lengthSides: {
        length1: 0,
        length2: 0,
        radius: 0,
      },
    },
    totalNumberOfBars: 0,
    totalWeightOfBars: 0,
    totalNumberOfStirrups: 0,
    totalWeightOfStirrups: 0,
    numberOfStirrupsPerColumns: 0,
  });
  const [showResult, setShowResult] = useState(false);

  const handleFormSubmit = (data: DataResultColunasInterface) => {
    const totalNumberOfBars = calculatesTotalNumberOfBars(data);
    const totalWeightOfBars = calculatesTotalWeightOfBars(data);
    const totalNumberOfStirrups = calculatesTotalNumberOfStirrups(data);
    const totalWeightOfStirrups = calculatesTotalWeightOfStirrups(data);
    const numberOfStirrupsPerColumns =
      calculatesNumberOfStirrupsPerColumns(data);

    setResult({
      ...data,
      totalNumberOfBars,
      totalWeightOfBars,
      totalNumberOfStirrups,
      totalWeightOfStirrups,
      numberOfStirrupsPerColumns,
    });

    setShowResult(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const resetForm = () => {
    setShowResult(false);
  };

  return (
    <>
      <Header></Header>
      {showResult != true ? (
        <FormCalculatorColunas onSubmit={handleFormSubmit} />
      ) : (
        <ResultsDisplay result={result} resetForm={resetForm} />
      )}
      <Footer></Footer>
    </>
  );
}

export default CalculatorColunas;

import rebarData from "../../../data/rebarData.json";
import { DataResultColunasInterface } from "./CalculatorColunas";

type GaugeType = keyof typeof rebarData.weights &
  keyof typeof rebarData.transpasses;

export const calculatesTotalNumberOfBars = (
  data: DataResultColunasInterface
): number => {
  const total: number =
    (data.numberOfColumns ?? 0) * (data.numberOfIronBars ?? 0);
  return total;
};

export const calculatesTotalWeightOfBars = (
  data: DataResultColunasInterface
): number => {
  const totalNumberOfBars = calculatesTotalNumberOfBars(data);
  const gauge = data.gaugeIronBars?.toString() as GaugeType;
  const weight =
    totalNumberOfBars *
    (rebarData.weights[gauge] ?? 0) *
    (data.metersOfColumns ?? 0);
  return weight;
};

export const calculatesTotalNumberOfStirrups = (
  data: DataResultColunasInterface
): number => {
  const numberOfStirrups =
    ((data.metersHaveStirrup ?? 0) / ((data.stirrupSpacing ?? 0) / 100)) *
    (data.numberOfColumns ?? 0);
  return Number(numberOfStirrups.toFixed(0));
};

export const calculatesTheTotalSizeOfOneStirrup = (
  data: DataResultColunasInterface
): number => {
  const shape = data.stirrupMeasurements?.shape;
  const length1 = data.stirrupMeasurements?.lengthSides?.length1 ?? 0;
  const length2 = data.stirrupMeasurements?.lengthSides?.length2 || 0;
  const radius = data.stirrupMeasurements?.lengthSides?.radius || 0;
  const gauge = data.stirrupMeasurements?.gauge?.toString() as GaugeType;
  let sizeOfOneStirrup = 0;
  const transpasse = rebarData.transpasses[gauge] * 2;

  if (shape === "rectangular") {
    sizeOfOneStirrup = length1 * 2 + length2 * 2 + transpasse;
  } else if (shape === "triangular") {
    sizeOfOneStirrup = length1 * 3 + transpasse;
  } else if (shape === "circular") {
    const pi = Math.PI;
    sizeOfOneStirrup = radius * pi * 2 + transpasse;
  } else {
    sizeOfOneStirrup = length1 * 4 + transpasse;
  }

  return sizeOfOneStirrup;
};

export const calculatesTotalWeightOfStirrups = (
  data: DataResultColunasInterface
) => {
  const numberOfStirrups = calculatesTotalNumberOfStirrups(data);
  const sizeOfOneStirrup = calculatesTheTotalSizeOfOneStirrup(data);
  const gauge = data.stirrupMeasurements?.gauge?.toString() as GaugeType;
  const weightPerGauge = rebarData.weights[gauge];
  const TotalWeightOfStirrups =
    (numberOfStirrups * sizeOfOneStirrup * weightPerGauge) / 100;
  return Number(TotalWeightOfStirrups.toFixed(2));
};

export const calculatesNumberOfStirrupsPerColumns = (
  data: DataResultColunasInterface
) => {
  const totalNumberOfStirrups = calculatesTotalNumberOfStirrups(data);

  const numberOfStirrupsPerColumns =
    totalNumberOfStirrups / (data.numberOfColumns ?? 1);

  return Number(numberOfStirrupsPerColumns.toFixed(0));
};

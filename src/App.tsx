import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom";

/* components */
import CalculatorSapatas from './components/calculators/calculatorsSapatas/CalculatorSapatas';
import CalculatorBobininhas from './components/calculators/calculatorBobininhas/CalculatorBobininhas';
import CalculatorEstribos from "./components/calculators/calculatorEstribos/CalculatorEstribos"
import CalculatorColunas from "./components/calculators/calculatorColunas/CalculatorColunas"
import Home from './components/Home';

function App() {

  return (
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/calculator-sapatas' element={<CalculatorSapatas/>}></Route>
        <Route path='/calculator-bobininhas' element={<CalculatorBobininhas/>}></Route>
        <Route path='/calculator-estribos' element={<CalculatorEstribos/>}></Route>
        <Route path='calculator-colunas' element={<CalculatorColunas/>}></Route>
      </ Routes>
  )
}

export default App

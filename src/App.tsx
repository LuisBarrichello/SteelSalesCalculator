import { Route, Routes } from 'react-router-dom';
import CalculatorSapatas from './components/calculators/calculatorsSapatas/CalculatorSapatas';
import CalculatorBobininhas from './components/calculators/calculatorBobininhas/CalculatorBobininhas';
import CalculatorEstribos from './components/calculators/calculatorEstribos/CalculatorEstribos';
import CalculatorColunas from './components/calculators/calculatorColunas/CalculatorColunas';
import Home from './components/Home';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-steel-50 to-primary-50">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/calculator-sapatas"
                    element={<CalculatorSapatas />}
                />
                <Route
                    path="/calculator-bobininhas"
                    element={<CalculatorBobininhas />}
                />
                <Route
                    path="/calculator-estribos"
                    element={<CalculatorEstribos />}
                />
                <Route
                    path="/calculator-colunas"
                    element={<CalculatorColunas />}
                />
            </Routes>
        </div>
    );
}

export default App;

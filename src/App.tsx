import { Route, Routes } from 'react-router-dom';
import CalculatorSapatas from './components/calculators/calculatorsSapatas/CalculatorSapatas';
import CalculatorBobininhas from './components/calculators/calculatorBobininhas/CalculatorBobininhas';
import CalculatorEstribos from './components/calculators/calculatorEstribos/CalculatorEstribos';
import CalculatorColunas from './components/calculators/calculatorColunas/CalculatorColunas';
import CalculatorDobrasEspeciais from './components/calculators/calculatorDobrasEspeciais/CalculatorDobrasEspeciais';
import RoutesPage from './components/routes/RoutesPage';
import Home from './components/Home';

function App() {
    return (
        <div className="min-h-screen bg-linear-to-br from-steel-50 to-primary-50">
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
                <Route
                    path="/calculator-dobras-especiais"
                    element={<CalculatorDobrasEspeciais />}
                />
                <Route path="/routes" element={<RoutesPage />} />
            </Routes>
        </div>
    );
}

export default App;

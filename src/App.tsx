import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import CalcSapatas from './components/CalcSapatas';
import CalcBobininhas from './components/CalcBobininhas';
import Home from './components/Home';

function App() {
  const [ calculatorSapatas, setCalculatorSapatas ] = useState(false);
  const [ calculatorBobininhas, setCalculatorBobininhas ] = useState(false);

  const definedTypeCalculatorSapatas = (event) => {
    event.preventDefault()
    setCalculatorSapatas(!calculatorSapatas)
  }

  const definedTypeCalculatorBobininhas = (event) => { 
    event.preventDefault();
    setCalculatorBobininhas(!calculatorBobininhas)
  }

  const resetCalculators = (event) => {
    event.preventDefault();
    setCalculatorSapatas(false);
    setCalculatorBobininhas(false);
  }

  let MainComponentToRender;

  if (calculatorSapatas) {
    MainComponentToRender = <CalcSapatas />;
  } else if (calculatorBobininhas) {
    MainComponentToRender = <CalcBobininhas />;
  } else {
    /* setCalculatorSapatas(!calculatorSapatas)
    setCalculatorBobininhas(!calculatorBobininhas) */
    MainComponentToRender = <Home />;
  }

  return (
    <>
      <Header 
        calculatorSapata={definedTypeCalculatorSapatas} 
        calculatorBobininha={definedTypeCalculatorBobininhas}
        resetCalculators={resetCalculators}
      ></Header>
      <Container>
        {MainComponentToRender}
      </Container>
      <Footer></Footer>
    </>
  )
}

export default App

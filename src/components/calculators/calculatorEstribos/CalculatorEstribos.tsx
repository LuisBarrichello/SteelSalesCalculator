import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useEffect, useState } from "react";
import FormCalculatorEstribos from "./FormCalculatorEstribos";

function CalculatorEstribos() {
    const [result, setResult] = useState(false)
    return (
        <>
            <Header></Header>
            {result === true ? 
                <span>resilta</span>
            :
                <FormCalculatorEstribos />
            }
            <Footer></Footer>
        </>
    )
}

export default CalculatorEstribos
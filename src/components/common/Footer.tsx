import IconGithub from "../../assets/img/github-mark-white.png"
import IconLinkedIn from "../../assets/img/linkedin logo.png"

function Footer() {

    return (
        <>
            <footer className="bg-dark text-light d-flex flex-column p-4 gap-2">
                <span>Desenvolvidor por: <a href="" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-light">Luís Gabriel Barrichello</a></span>
                <div>
                    <a 
                        href="https://github.com/LuisBarrichello" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-decoration-none text-light d-flex gap-2 align-items-center"
                    >
                        <img src={IconGithub} alt="" style={{ width: '1.1rem', height: '1.1rem' }}/>
                        <span>GitHub</span>
                    </a>
                    <a 
                        href="https://www.linkedin.com/in/luisgabrielbarrichello/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-decoration-none text-light d-flex gap-2 align-items-center"
                    >
                        <img src={IconLinkedIn} alt="" style={{ width: '1rem', height: '1rem' }}/>
                        <span>LinkedIn</span>
                    </a>
                </div>
            </footer>
        </>
    )
}

export default Footer
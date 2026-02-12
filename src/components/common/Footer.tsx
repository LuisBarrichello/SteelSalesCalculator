import { Github, Linkedin } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-steel-900 text-steel-100 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-sm">
                            Desenvolvido por {' '}
                            <a 
                                href="https://github.com/LuisBarrichello"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary-400 hover:text-primary-300 transition-colors">Luís Gabriel Barrichello
                            </a>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/LuisBarrichello"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-steel-800 hover:bg-steel-700 transition-colors group"
                            aria-label="GitHub"
                        >
                            <Github className="w-4 h-4 text-steel-300 group-hover:text-white transition-colors" />
                            <span className="text-sm text-steel-300 group-hover:text-white transition-colors">
                                GitHub
                            </span>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/luisgabrielbarrichello/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-steel-800 hover:bg-steel-700 transition-colors group"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-4 h-4 text-steel-300 group-hover:text-white transition-colors" />
                            <span className="text-sm text-steel-300 group-hover:text-white transition-colors">
                                LinkedIn
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
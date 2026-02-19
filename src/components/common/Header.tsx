import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Calculator } from 'lucide-react';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/calculator-bobininhas', label: 'Bobininhas' },
        { to: '/calculator-sapatas', label: 'Sapatas' },
        { to: '/calculator-estribos', label: 'Estribos' },
        { to: '/calculator-colunas', label: 'Colunas' },
    ];

    return (
        <header className="bg-white shadow-md print:hidden">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <NavLink
                        to="/"
                        className="flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors">
                        <Calculator className="w-6 h-6" />
                        <span className="font-bold text-lg hidden sm:inline">
                            Steel Sales Calculator
                        </span>
                        <span className="font-bold text-lg sm:hidden">SSC</span>
                    </NavLink>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-steel-600 hover:bg-steel-100 hover:text-steel-900'
                                    }`
                                }>
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-steel-100 transition-colors"
                        aria-label="Toggle menu">
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-steel-600" />
                        ) : (
                            <Menu className="w-6 h-6 text-steel-600" />
                        )}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-steel-200">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                            isActive
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-steel-600 hover:bg-steel-100 hover:text-steel-900'
                                        }`
                                    }>
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;

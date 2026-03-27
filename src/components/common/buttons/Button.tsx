import React from 'react';

export interface ButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'outline-success' | 'outline' | 'none';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'none';
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    className?: string; // Permitindo estilização customizada no React
}

export function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled,
    fullWidth,
    icon,
    className = '',
}: ButtonProps) {
    const baseClasses = `
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
    `;

    const variants = {
        primary: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-4 focus:ring-sky-200 shadow-sm',
        secondary: 'bg-steel-600 text-white hover:bg-steel-700 focus:ring-4 focus:ring-steel-200 shadow-sm',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-200 shadow-sm',
        ghost: 'bg-transparent text-steel-600 hover:bg-steel-100',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 shadow-sm',
        'outline-success': 'bg-transparent text-emerald-700 border-2 border-emerald-300 hover:bg-emerald-50',
        outline: 'bg-transparent text-steel-700 border-2 border-steel-200 hover:bg-steel-50',
        none: '', 
    };

    const sizes = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        none: '',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`cursor-pointer ${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`.trim()}>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </button>
    );
}
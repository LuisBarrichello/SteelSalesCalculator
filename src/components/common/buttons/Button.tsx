interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
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
}: ButtonProps) {
    const baseClasses = `
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
    `;

    const variants = {
        primary:
            'bg-primary-600 text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200',
        secondary:
            'bg-steel-600 text-white hover:bg-steel-700 focus:ring-4 focus:ring-steel-200',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-200',
        ghost: 'bg-transparent text-steel-700 hover:bg-steel-100 border-2 border-steel-300',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}>
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}

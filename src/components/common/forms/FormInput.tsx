interface FormInputProps {
    label: string;
    type?: 'text' | 'number' | 'select';
    value: string | number;
    onChange: (value: string) => void;
    min?: number;
    max?: number;
    step?: string;
    error?: boolean;
    errorMessage?: string;
    required?: boolean;
    children?: React.ReactNode;
    disabled?: boolean;
}

export function FormInput({
    label,
    type = 'text',
    value,
    onChange,
    min,
    step,
    error,
    errorMessage,
    required,
    children,
    disabled,
}: FormInputProps) {
    const baseInputClasses = `
        w-full px-4 py-3 rounded-lg border-2 transition-all
        bg-white disabled:bg-steel-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
        ${
            error
                ? 'border-red-300 focus:ring-red-500'
                : 'border-steel-200 hover:border-steel-300'
        }
    `;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-steel-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {type === 'select' ? (
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseInputClasses}
                    disabled={disabled}>
                    {children}
                </select>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    min={min}
                    step={step}
                    className={baseInputClasses}
                    disabled={disabled}
                />
            )}

            {error && errorMessage && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {errorMessage}
                </p>
            )}
        </div>
    );
}

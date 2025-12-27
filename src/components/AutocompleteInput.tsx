import { useState, useRef, useEffect } from 'react';

interface AutocompleteOption {
    id: string;
    label: string;
}

interface AutocompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    options: AutocompleteOption[];
    placeholder?: string;
    maxSuggestions?: number;
}

/**
 * Input con autocompletado tipo WhatsApp
 * Muestra sugerencias mientras escribes
 */
export function AutocompleteInput({
    value,
    onChange,
    options,
    placeholder = '',
    maxSuggestions = 3,
}: AutocompleteInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filtrar opciones cuando cambia el valor
    useEffect(() => {
        if (!value.trim()) {
            setFilteredOptions([]);
            setIsOpen(false);
            return;
        }

        const query = value.toLowerCase();
        const matches = options.filter(opt =>
            opt.label.toLowerCase().includes(query) ||
            opt.id.toLowerCase().includes(query)
        ).slice(0, maxSuggestions);

        setFilteredOptions(matches);
        setIsOpen(matches.length > 0);
        setHighlightedIndex(0);
    }, [value, options, maxSuggestions]);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(i => Math.min(i + 1, filteredOptions.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(i => Math.max(i - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredOptions[highlightedIndex]) {
                    selectOption(filteredOptions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const selectOption = (option: AutocompleteOption) => {
        onChange(option.id);
        setIsOpen(false);
        inputRef.current?.blur();
    };

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    if (filteredOptions.length > 0) setIsOpen(true);
                }}
                placeholder={placeholder}
                style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: 'var(--color-text-primary)',
                    width: '130px',
                    fontSize: '0.9rem',
                }}
            />

            {isOpen && filteredOptions.length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'var(--color-bg-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        marginTop: '4px',
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        overflow: 'hidden',
                    }}
                >
                    {filteredOptions.map((option, index) => (
                        <div
                            key={option.id}
                            onClick={() => selectOption(option)}
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                background: index === highlightedIndex
                                    ? 'var(--color-bg-highlight)'
                                    : 'transparent',
                                color: 'var(--color-text-primary)',
                                fontSize: '0.9rem',
                                borderBottom: index < filteredOptions.length - 1
                                    ? '1px solid var(--color-border)'
                                    : 'none',
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AutocompleteInput;

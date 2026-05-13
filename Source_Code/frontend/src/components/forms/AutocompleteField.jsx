import { useEffect, useMemo, useRef, useState } from 'react';

export default function AutocompleteField({
  label,
  name,
  value,
  onChange,
  options = [],
  helperText,
  placeholder = 'Start typing...',
  required = false
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const filteredOptions = useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) {
      return options.slice(0, 12);
    }

    const startsWith = options.filter((option) => option.toLowerCase().startsWith(query));
    const includes = options.filter(
      (option) => !option.toLowerCase().startsWith(query) && option.toLowerCase().includes(query)
    );

    return [...startsWith, ...includes].slice(0, 12);
  }, [options, value]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="field autocomplete-field" ref={rootRef}>
      <label htmlFor={name}>{label}</label>
      <div className={`autocomplete-shell ${open ? 'open' : ''}`}>
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          required={required}
        />
        <button
          type="button"
          className="autocomplete-toggle"
          aria-label="Toggle university suggestions"
          onClick={() => setOpen((current) => !current)}
        >
          ▾
        </button>
      </div>

      {open ? (
        <div className="autocomplete-menu" role="listbox">
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <button
                type="button"
                key={option}
                className={`autocomplete-option ${value === option ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            ))
          ) : (
            <div className="autocomplete-empty">No matching university found.</div>
          )}
        </div>
      ) : null}

      {helperText ? <small className="field-helper">{helperText}</small> : null}
    </div>
  );
}

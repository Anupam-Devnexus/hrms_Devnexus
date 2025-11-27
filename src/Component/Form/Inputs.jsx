import React from "react";

/**
 * Shared wrapper for label + error + hint
 */
const FieldWrapper = ({ label, required, error, hint, children }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label className="block text-gray-700 font-semibold text-sm">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
      </div>

      {children}

      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
};

export const TextInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  maxLength,
  error,
  hint,
  type = "text",
  showCounter = false,
  containerClass = "",
  ...rest
}) => {
  const length = value?.length || 0;

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label className="block text-gray-700 font-semibold text-sm">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {showCounter && maxLength && (
          <span className="text-[11px] text-gray-400">
            {length}/{maxLength}
          </span>
        )}
      </div>

      <input
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        onChange={onChange}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-400"
        }`}
        {...rest}
      />

      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
};

export const TextArea = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  maxLength,
  error,
  hint,
  rows = 4,
  showCounter = false,
  containerClass = "",
  ...rest
}) => {
  const length = value?.length || 0;

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label className="block text-gray-700 font-semibold text-sm">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {showCounter && maxLength && (
          <span className="text-[11px] text-gray-400">
            {length}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        name={name}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        onChange={onChange}
        rows={rows}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-y max-h-52 ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-400"
        }`}
        {...rest}
      />

      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
};

export const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  hint,
  containerClass = "",
  ...rest
}) => {
  return (
    <div className={containerClass}>
      <FieldWrapper label={label} required={required} error={error} hint={hint}>
        <select
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    </div>
  );
};

export const DateInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  min,
  max,
  error,
  hint,
  containerClass = "",
  ...rest
}) => {
  return (
    <div className={containerClass}>
      <FieldWrapper label={label} required={required} error={error} hint={hint}>
        <input
          type="date"
          name={name}
          value={value}
          disabled={disabled}
          min={min}
          max={max}
          onChange={onChange}
          className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-300"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          {...rest}
        />
      </FieldWrapper>
    </div>
  );
};

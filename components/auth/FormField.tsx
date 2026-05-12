import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = forwardRef<HTMLInputElement, FieldProps>(
  function FormField({ label, error, hint, className, id, ...rest }, ref) {
    const fieldId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={fieldId}
          className="text-xs font-bold text-navy/75 tracking-wide"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            "rounded-xl border-2 bg-white px-3.5 py-3 text-sm text-navy placeholder:text-navy/30 transition-all min-h-[44px]",
            "focus:outline-none focus:ring-4",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/15"
              : "border-navy/10 focus:border-orange focus:ring-orange/15",
            className,
          )}
          {...rest}
        />
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-navy/50">{hint}</p>
        ) : null}
      </div>
    );
  },
);

interface CheckboxProps {
  label: React.ReactNode;
  error?: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  name?: string;
}

export function FormCheckbox({
  label,
  error,
  checked,
  onChange,
  name,
}: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-start gap-2.5 text-sm text-navy/75 cursor-pointer select-none">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-navy/20 text-orange focus:ring-orange/30 accent-orange"
        />
        <span className="leading-snug">{label}</span>
      </label>
      {error && <p className="text-xs text-red-600 font-medium ml-7">{error}</p>}
    </div>
  );
}

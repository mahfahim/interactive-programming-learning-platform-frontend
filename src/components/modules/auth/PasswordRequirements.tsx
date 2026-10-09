import { Check, X } from "lucide-react";
import type React from "react";

interface PasswordRequirementsProps {
  password?: string;
}

interface Requirement {
  label: string;
  isValid: boolean;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password = "",
}) => {
  const requirements: Requirement[] = [
    { label: "At least 8 characters", isValid: password.length >= 8 },
    { label: "One lowercase letter", isValid: /[a-z]/.test(password) },
    { label: "One uppercase letter", isValid: /[A-Z]/.test(password) },
    { label: "One number", isValid: /[0-9]/.test(password) },
    {
      label: "One special character",
      isValid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  if (!password) {
    return (
      <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground mb-1">
          Password requirements:
        </p>
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {requirements.map((req) => (
            <li key={req.label} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
              <span>{req.label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-muted/40 p-3 text-xs space-y-1">
      <p className="font-medium text-foreground mb-1">Password requirements:</p>
      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {requirements.map((req) => (
          <li
            key={req.label}
            className={`flex items-center gap-1.5 font-medium ${
              req.isValid
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground"
            }`}
          >
            {req.isValid ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            )}
            <span>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

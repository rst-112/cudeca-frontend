import * as React from "react"
import { cn } from "../../lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)
        const isPasswordType = type === "password"

        // Clases base compartidas
        const baseClasses = "flex h-10 w-full rounded-md border border-cudeca-gris-borde bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-cudeca-gris-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cudeca-verde focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-cudeca-gris-disabled/20 disabled:opacity-50"

        if (isPasswordType) {
            return (
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className={cn(baseClasses, "pr-10", className)}
                        ref={ref}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
            )
        }

        return (
            <input
                type={type}
                className={cn(baseClasses, className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cudeca: {
                    verde: "#00A651",       // Verde principal
                    "verde-dark": "#00753E", // Hover
                    naranja: "#F29325",     // Acento
                    rojo: "#D94F04",        // Error
                    gris: {
                        disabled: "#D1D5DC",
                        borde: "#99A1AF",
                        texto: "#6A7282",
                        claro: "#878787"
                    }
                }
            }
        },
    },
    plugins: [],
}
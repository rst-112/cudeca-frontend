import React, { useState } from "react";
import { Check } from "lucide-react";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
  features: string[];
  isActive: boolean;
  ctaText: string;
}

export const SubscriptionSection = (): JSX.Element => {
  const [selectedPlan, setSelectedPlan] = useState<number>(1);

  const plans: SubscriptionPlan[] = [
    {
      id: 1,
      name: "Socio Amigo",
      price: 10,
      billingPeriod: "mes",
      description: "Colaboración básica",
      features: [
        "Acceso a eventos exclusivos",
        "Boletín mensual",
        "10% descuento en tienda",
        "Certificado de donación",
      ],
      isActive: true,
      ctaText: "Plan Actual",
    },
    {
      id: 2,
      name: "Socio Protector",
      price: 25,
      billingPeriod: "mes",
      description: "Colaboración incrementada",
      features: [
        "Todo de Socio Amigo",
        "Invitaciones a eventos VIP",
        "20% descuento en tienda",
        "Reconocimiento en web",
        "Acceso a reportes mensuales",
      ],
      isActive: false,
      ctaText: "Mejorar Plan",
    },
    {
      id: 3,
      name: "Socio Benefactor",
      price: 50,
      billingPeriod: "mes",
      description: "Máximo compromiso",
      features: [
        "Todo de Socio Protector",
        "Cena anual privada",
        "30% descuento en tienda",
        "Mención en boletín",
        "Acceso a eventos especiales",
        "Asesoramiento personalizado",
      ],
      isActive: false,
      ctaText: "Mejorar Plan",
    },
  ];

  return (
    <main className="flex-1 bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-8 py-12">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Elige tu Plan de Suscripción
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Tu aporte constante nos ayuda a mantener nuestros cuidados paliativos gratuitos.
            Elige el plan que mejor se adapte a ti.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                plan.isActive
                  ? "ring-2 ring-[#00753e] shadow-xl"
                  : "border border-slate-200 dark:border-slate-800"
              }`}
            >
              {/* Card Background */}
              <div
                className={`p-8 space-y-6 ${
                  plan.isActive
                    ? "bg-[#00753e] text-white"
                    : "bg-white dark:bg-slate-950"
                }`}
              >
                {/* Active Badge */}
                {plan.isActive && (
                  <div className="absolute top-0 right-0 bg-[#00a651] px-4 py-1 text-xs font-bold text-white">
                    ACTIVO
                  </div>
                )}

                {/* Plan Name */}
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.isActive ? "text-white" : "text-slate-900 dark:text-white"
                  }`}>{plan.name}</h3>
                  <p
                    className={`text-sm ${
                      plan.isActive ? "text-green-100" : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${
                    plan.isActive ? "text-white" : "text-slate-900 dark:text-white"
                  }`}>{plan.price}€</span>
                  <span className={`text-sm ${plan.isActive ? "text-green-100" : "text-slate-600 dark:text-slate-400"}`}>
                    / {plan.billingPeriod}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check
                        size={20}
                        className={`flex-shrink-0 ${
                          plan.isActive ? "text-green-200" : "text-[#00753e]"
                        }`}
                      />
                      <span className={`text-sm ${plan.isActive ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mt-6 ${
                    plan.isActive
                      ? "bg-white text-[#00753e] hover:bg-gray-100"
                      : "bg-[#00753e] text-white hover:bg-[#005a2e] dark:bg-[#00753e] dark:hover:bg-[#005a2e]"
                  }`}
                  disabled={plan.isActive}
                >
                  {plan.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cancellation Info */}
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Información sobre tu suscripción
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Próxima facturación
              </h4>
              <p className="text-slate-600 dark:text-slate-400">15 de enero, 2025</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Método de pago
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Tarjeta ***4567
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Duración de la suscripción
              </h4>
              <p className="text-slate-600 dark:text-slate-400">Desde 15 de noviembre, 2024</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Acciones
              </h4>
              <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                Cancelar suscripción
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

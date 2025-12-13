import React, { useState } from "react";

export const MainContentSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<"general" | "tickets">("general");
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    location: "",
    fundraisingGoal: "",
  });

  const tabs = [
    { id: "general" as const, label: "Información General" },
    { id: "tickets" as const, label: "Tipos de Entrada" },
  ];

  const leftFormFields = [
    {
      id: "eventName",
      label: "Nombre del evento",
      placeholder: "Introduzca un nombre",
      type: "text" as const,
    },
    {
      id: "description",
      label: "Descripción del evento",
      placeholder: "Texto donde describa al evento",
      type: "textarea" as const,
    },
    {
      id: "imageUrl",
      label: "URL de la imagen",
      placeholder: "https://.../imagen.jpg",
      type: "text" as const,
    },
  ];

  const rightFormFields = [
    {
      id: "startDate",
      label: "Fecha de inicio",
      placeholder: "dia/mes/año",
      type: "text" as const,
    },
    {
      id: "endDate",
      label: "Fecha de fin",
      placeholder: "dia/mes/año",
      type: "text" as const,
    },
    {
      id: "location",
      label: "Lugar de evento",
      placeholder: "Dirección",
      type: "text" as const,
    },
    {
      id: "fundraisingGoal",
      label: "Objetivo de recaudación",
      placeholder: "Introduzca un objetivo en euros",
      type: "text" as const,
    },
  ];

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDiscard = () => {
    setFormData({
      eventName: "",
      description: "",
      imageUrl: "",
      startDate: "",
      endDate: "",
      location: "",
      fundraisingGoal: "",
    });
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
  };

  const handlePublish = () => {
    console.log("Publishing event:", formData);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Header */}
      <header className="px-8 pt-12 pb-6">
        <h1 className="text-4xl font-normal text-[#00a651] dark:text-[#00d66a] [font-family:'Arimo-Regular',Helvetica]">
          Formulario de creación de eventos
        </h1>
      </header>

      {/* Tabs */}
      <nav className="px-8 border-b border-slate-200 dark:border-slate-700 flex gap-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-2 font-normal [font-family:'Arimo-Regular',Helvetica] text-xl transition-colors ${
              activeTab === tab.id
                ? "text-[#00a651] dark:text-[#00d66a] border-b-2 border-[#00a651] dark:border-[#00d66a]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Form Container */}
      <main className="flex-1 m-8 p-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <form className="flex gap-12">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            {leftFormFields.map((field) => (
              <div key={field.id} className="flex flex-col gap-3">
                <label
                  htmlFor={field.id}
                  className="text-lg font-normal text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]"
                >
                  {field.label}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={8}
                    className="w-full p-6 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica] text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full h-16 px-6 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica] text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-8">
            {rightFormFields.map((field) => (
              <div key={field.id} className="flex flex-col gap-3">
                <label
                  htmlFor={field.id}
                  className="text-lg font-normal text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica]"
                >
                  {field.label}
                </label>

                <input
                  type={field.type}
                  id={field.id}
                  value={formData[field.id as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full h-16 px-6 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white [font-family:'Arimo-Regular',Helvetica] text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#00a651] dark:focus:border-[#00d66a] transition-colors"
                />
              </div>
            ))}
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="flex gap-6 justify-end mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-10 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 font-bold [font-family:'Arimo-Regular',Helvetica] text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Descartar
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-10 py-3 rounded-2xl border-2 border-[#00a651] dark:border-[#00d66a] text-[#00a651] dark:text-[#00d66a] bg-green-50 dark:bg-slate-900 font-bold [font-family:'Arimo-Regular',Helvetica] text-lg hover:bg-green-100 dark:hover:bg-slate-800 transition-colors"
          >
            Guardar Borrador
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="px-10 py-3 rounded-2xl border-0 text-white bg-[#00a651] dark:bg-[#00a651] font-bold [font-family:'Arimo-Regular',Helvetica] text-lg hover:bg-[#008a43] dark:hover:bg-[#008a43] transition-colors shadow-lg"
          >
            Publicar Evento
          </button>
        </div>
      </main>
    </div>
  );
};


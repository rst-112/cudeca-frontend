import { useState } from 'react';

interface ProfileField {
  label: string;
  value: string;
}

export const ProfileInformationSection = () => {
  const [profileData] = useState<ProfileField[]>([
    { label: 'Nombre', value: 'Juan Carlos' },
    { label: 'Apellidos', value: 'García Martínez' },
    { label: 'Correo electrónico', value: 'juancarlos.garcia@email.com' },
    { label: 'Teléfono', value: '+34 612 345 678' },
  ]);

  const handleEdit = () => {
    console.log('Edit button clicked');
  };

  return (
    <section className="w-full max-w-[1136px] mx-auto mt-8 px-4 pb-8">
      <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
        {/* Profile information card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-[#00753e] p-6">
          <dl className="space-y-3 mb-6">
            {profileData.map((field, index) => (
              <div key={index} className="flex gap-4">
                <dt className="w-[180px] font-bold text-slate-900 dark:text-white text-base font-['Arimo']">
                  {field.label}:
                </dt>
                <dd className="flex-1 text-slate-700 dark:text-slate-300 text-base font-['Arimo']">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>

          <button
            onClick={handleEdit}
            className="px-8 py-2 bg-[#00bcd4] hover:bg-[#00acc1] text-white text-base font-['Arimo'] rounded-[20px] transition-colors"
            aria-label="Editar información del perfil"
          >
            Editar
          </button>
        </div>
      </article>
    </section>
  );
};

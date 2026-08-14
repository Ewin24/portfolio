/**
 * The insomnia labels.
 *
 * In the novel, a town losing its memory defends itself by tying a written
 * card to every object: the name of the thing, and underneath it, what the
 * thing is for. The tone is deliberately plain and instructional — nobody is
 * being clever, they are trying not to forget how a cow works.
 *
 * The skills grid is that defence. These are the cards. They are written in
 * that register on purpose: "This is X. It is for Y." Short, useful, slightly
 * absurd when read one after another, which is exactly right.
 *
 * This copy lives with the theme rather than in src/i18n, because only the
 * book theme ever shows it. Putting it in the shared TranslationKeys type
 * would widen a contract the newspaper theme never uses.
 */

export interface InsomniaLabel {
  /** Matches the technology id in Skills.tsx TECH_DATA. */
  id: string
  es: string
  en: string
}

export const INSOMNIA_LABELS: InsomniaLabel[] = [
  {
    id: 'dotnet',
    es: 'Esto es .NET. Sirve para levantar sistemas que todavía deben estar en pie dentro de diez años.',
    en: 'This is .NET. It is for raising systems that must still be standing ten years from now.',
  },
  {
    id: 'php',
    es: 'Esto es PHP con Laravel. Sirve para que una idea esté en línea antes de que se enfríe.',
    en: 'This is PHP with Laravel. It is for putting an idea online before it goes cold.',
  },
  {
    id: 'sqlserver',
    es: 'Esto es SQL Server. Sirve para guardar lo que no se puede perder.',
    en: 'This is SQL Server. It is for keeping what cannot be lost.',
  },
  {
    id: 'react',
    es: 'Esto es React. Sirve para que una pantalla cambie sin recargar el mundo entero.',
    en: 'This is React. It is for changing a screen without reloading the entire world.',
  },
  {
    id: 'typescript',
    es: 'Esto es TypeScript. Sirve para que el error aparezca antes que el usuario.',
    en: 'This is TypeScript. It is for making the error show up before the user does.',
  },
  {
    id: 'aws',
    es: 'Esto es AWS. Sirve para que el sistema siga despierto cuando uno se va a dormir.',
    en: 'This is AWS. It is for keeping the system awake after you have gone to sleep.',
  },
  {
    id: 'flutter',
    es: 'Esto es Flutter. Sirve para escribir una vez y que funcione en dos teléfonos distintos.',
    en: 'This is Flutter. It is for writing once and having it work on two different phones.',
  },
  {
    id: 'cleanarch',
    es: 'Esto es Clean Architecture. Sirve para poder cambiar de opinión sin romperlo todo.',
    en: 'This is Clean Architecture. It is for changing your mind without breaking everything.',
  },
  {
    id: 'docker',
    es: 'Esto es Docker. Sirve para que funcione igual en su máquina y en la mía.',
    en: 'This is Docker. It is for making it run the same on your machine and on mine.',
  },
  {
    id: 'java',
    es: 'Esto es Java con Spring Boot. Sirve para lo que un banco no puede permitirse perder.',
    en: 'This is Java with Spring Boot. It is for what a bank cannot afford to lose.',
  },
  {
    id: 'postgresql',
    es: 'Esto es PostgreSQL. Sirve para preguntas que nadie pensó en hacer al principio.',
    en: 'This is PostgreSQL. It is for questions nobody thought to ask at the start.',
  },
  {
    id: 'azure',
    es: 'Esto es Azure. Sirve para cuando la empresa ya eligió Microsoft.',
    en: 'This is Azure. It is for when the company already chose Microsoft.',
  },
]

const BY_ID = new Map(INSOMNIA_LABELS.map((label) => [label.id, label]))

export function insomniaLabel(id: string, lang: 'es' | 'en'): string | null {
  const label = BY_ID.get(id)
  return label ? label[lang] : null
}

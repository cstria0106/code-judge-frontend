export const languages = ['C', 'CPP', 'JAVA'] as const;

export type Language = (typeof languages)[number];

export const languageNames: Record<string, string> = {
  C: 'C',
  CPP: 'C++',
  JAVA: 'Java',
} satisfies Record<Language, string>;

export interface Word {
  id: string;
  kanji?: string;
  reading: string;
  meaning: string;
  pos: string;
  example?: {
    ja: string;
    en: string;
  };
}

export type GroupMode = 'semantic' | 'phonetic';

export interface Group {
  id: string;
  label: string;
  wordIds: string[];
}

export interface PhoneticSubMode {
  id: 'mora' | 'confusable';
  label: string;
}

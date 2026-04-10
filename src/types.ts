export type PetId = 'bioBlob' | 'roboPup' | 'astroCritter' | 'geoGolem';

export interface PetEquipped {
  color: string;
  accessory: string;
}

export interface ExperimentProgress {
  knowledge: boolean;
  training: boolean;
  challenge: boolean;
  stars: number;
}

export interface DailyQuest {
  id: string;
  type: 'points' | 'complete' | 'energy' | 'perfect_score' | 'study' | 'feed';
  target: number;
  progress: number;
  description: string;
  reward: number;
  claimed: boolean;
}

export interface UserProfile {
  petName: string | null;
  petId: PetId | null;
  totalPoints: number;
  petEnergy: number;
  petHappiness: number;
  lastLogin: string | null;
  experimentProgress: Record<string, ExperimentProgress>;
  badges: string[];
  unlockedItems: string[];
  equipped: PetEquipped;
  dailyQuests: DailyQuest[];
  lastQuestGenerationDate: string | null;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface Experiment {
  id: string;
  title: string;
  badgeName: string;
  icon: string; // Lucide icon name or similar
  description: string;
  knowledge: {
    title: string;
    pages: { text: string }[];
  };
  training: {
    title: string;
    flashcards: Flashcard[];
  };
  challenge: {
    title: string;
    gameType: 'dragAndDrop' | 'chooseYourResponse' | 'matchThePairs' | 'buildTheSystem' | 'sortTheSequence';
    content: any;
  };
}

import { CustomImageSlot } from '../types/game';

/**
 * 12 Card Image Slots configured with the user-provided images.
 * Level 1: 4 random pairs picked from these 12.
 * Level 2: 8 random pairs picked from these 12.
 * Level 3: All 12 pairs used.
 */
export const DEFAULT_IMAGE_SLOTS: CustomImageSlot[] = [
  {
    id: 'slot-1',
    name: 'Chill Cat',
    src: '/assets/aistudio/cat_05e7e1e0.jpg',
  },
  {
    id: 'slot-2',
    name: "Because I'm Crazy",
    src: '/assets/aistudio/crazy_31c45d1f.jpg',
  },
  {
    id: 'slot-3',
    name: 'Lock In Diva',
    src: '/assets/aistudio/lockin_2301cbae.jpg',
  },
  {
    id: 'slot-4',
    name: 'Unemployed Loser CV',
    src: '/assets/aistudio/loser_b6cec233.jpg',
  },
  {
    id: 'slot-5',
    name: '#OpenToWork',
    src: '/assets/aistudio/linkedin_pfp_337cd255.jpg',
  },
  {
    id: 'slot-6',
    name: 'Work 💔',
    src: '/assets/aistudio/work_510136f6.jpg',
  },
  {
    id: 'slot-7',
    name: 'Eminem Job Application',
    src: '/assets/aistudio/eminm_35637b89.jpg',
  },
  {
    id: 'slot-8',
    name: "Let's Get This Degree",
    src: '/assets/aistudio/crying_kid_1fda220e.jpg',
  },
  {
    id: 'slot-9',
    name: 'Screaming Coder Cat',
    src: '/assets/aistudio/crying_cat_bff1aa0f.jpg',
  },
  {
    id: 'slot-10',
    name: 'Clock Cat',
    src: '/assets/aistudio/time_15b56072.jpg',
  },
  {
    id: 'slot-11',
    name: 'Application Rabbit',
    src: '/assets/aistudio/rabit_11fdefe3.jpg',
  },
  {
    id: 'slot-12',
    name: 'HelloWorld Doge',
    src: '/assets/aistudio/coder_e44cf1d8.jpg',
  },
];

const STORAGE_KEY = 'memory_game_custom_images_v3';

export function getCustomImageSlots(): CustomImageSlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_IMAGE_SLOTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_IMAGE_SLOTS;

    // Merge with defaults to ensure all 12 slots are populated
    return DEFAULT_IMAGE_SLOTS.map((defSlot) => {
      const match = parsed.find((p: CustomImageSlot) => p.id === defSlot.id);
      return match && match.src ? { ...defSlot, src: match.src, name: match.name || defSlot.name } : defSlot;
    });
  } catch {
    return DEFAULT_IMAGE_SLOTS;
  }
}

export function saveCustomImageSlots(slots: CustomImageSlot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  } catch (err) {
    console.error('Failed to save custom images:', err);
  }
}

export function resetCustomImageSlots(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset custom images:', err);
  }
}

import menuData from "@/data/menu.json";
import type { MenuItem, PersonalAnswers } from "./types";

const menu = menuData as MenuItem[];

export function listMenu(): MenuItem[] {
  return menu;
}

export function findMenu(id: string): MenuItem | undefined {
  return menu.find((m) => m.id === id);
}

// PersonalAnswers (Japanese) → profile tag (english) mapping.
// Keys are substrings; first matching key wins.
const TASTE_MAP: Record<string, string[]> = {
  苦味: ["bitter"],
  酸味: ["acid", "fruity"],
  ミルク: ["milk"],
  甘さ: ["sweet"],
};
const SCENE_MAP: Record<string, string[]> = {
  朝: ["morning"],
  会議: ["meeting"],
  集中: ["focus"],
  休憩: ["break"],
  雑談: ["chat"],
};
const MOOD_MAP: Record<string, string[]> = {
  ぼんやり: ["wake"],
  集中: ["focus"],
  一息: ["relax"],
  上げ: ["lift"],
};

function mapTags(value: string, table: Record<string, string[]>): string[] {
  for (const key of Object.keys(table)) {
    if (value.includes(key)) return table[key];
  }
  return [];
}

export function answersToTags(a: PersonalAnswers) {
  return {
    taste: mapTags(a.taste, TASTE_MAP),
    scene: mapTags(a.scene, SCENE_MAP),
    mood: mapTags(a.mood, MOOD_MAP),
  };
}

export type MenuMatch = {
  item: MenuItem;
  score: number;
  matchedTags: string[];
};

export function matchMenu(a: PersonalAnswers, topN = 3): MenuMatch[] {
  const tags = answersToTags(a);
  const scored: MenuMatch[] = menu.map((item) => {
    const matched: string[] = [];
    let score = 0;
    for (const t of tags.taste) {
      if (item.profile.taste.includes(t)) {
        score += 3;
        matched.push(t);
      }
    }
    for (const s of tags.scene) {
      if (item.profile.scene.includes(s)) {
        score += 2;
        matched.push(s);
      }
    }
    for (const m of tags.mood) {
      if (item.profile.mood.includes(m)) {
        score += 1;
        matched.push(m);
      }
    }
    return { item, score, matchedTags: matched };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

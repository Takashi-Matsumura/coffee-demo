export type PersonalAnswers = {
  mood: string;
  scene: string;
  taste: string;
};

export type TeamAnswers = {
  size: string;
  style: string;
  meetings: string;
};

export type DiagnoseRequest =
  | { mode: "personal"; answers: PersonalAnswers }
  | { mode: "team"; answers: TeamAnswers };

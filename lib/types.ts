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

export type DepartmentAnswers = {
  department: string;
  size: string;
  style: string;
};

export type MeetingAnswers = {
  meetingType: string;
  attendees: string;
  timing: string;
};

export type DiagnoseMode = "personal" | "team" | "department" | "meeting";

export type DiagnoseRequest =
  | { mode: "personal"; answers: PersonalAnswers }
  | { mode: "team"; answers: TeamAnswers }
  | { mode: "department"; answers: DepartmentAnswers }
  | { mode: "meeting"; answers: MeetingAnswers };

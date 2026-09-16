/** GET /api/participants — элемент списка. */
export interface Participant {
  id: string;
  name: string;
  role: string;
  skills: string[];
  lookingForTeam: boolean;
}

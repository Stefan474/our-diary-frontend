export interface DiaryEntry {
  id: number;
  message: string;
  date: string;
  userId: number;
  // Add other properties based on your DiaryEntry model
}

export interface AllEntriesResponse {
  yourEntries: DiaryEntry[];
  partnerEntries: DiaryEntry[];
}

export interface QuestionOption {
  label: string;
  text: string;
}

export interface QuestionItem {
  id: number;
  type: string;
  title: string;
  options: QuestionOption[];
  correctAnswer: string[];
  selectedAnswer: string[];
  images?: string[];
}

export interface ExamData {
  source: string;
  ts: number;
  items: QuestionItem[];
}

export interface SingleExamEntry {
  type: 'exam';
  id: string; // unique ID
  name: string; // filename or generated name
  dateAdded: number;
  data: ExamData;
}

export interface FolderEntry {
  type: 'folder';
  id: string;
  name: string;
  dateAdded: number;
  children: SingleExamEntry[];
}

export type LibraryEntry = SingleExamEntry | FolderEntry;

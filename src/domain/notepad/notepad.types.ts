export interface Notepad {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotepadPage {
  id: number;
  notepadId: number;
  pageNumber: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePageInput {
  pageNumber: number;
  title?: string;
  content?: string;
}

export interface UpdatePageInput {
  title?: string;
  content?: string;
}

// DB row types (snake_case from PostgreSQL)
export interface NotepadRow {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface NotepadPageRow {
  id: number;
  notepad_id: number;
  page_number: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

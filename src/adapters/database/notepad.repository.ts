import { CreatePageInput, Notepad, NotepadPage, NotepadPageRow, NotepadRow, UpdatePageInput } from "@/src/domain/notepad/notepad.types";
import { pool } from "./client";

// Helper functions to map DB rows to domain objects
function mapNotepad(row: NotepadRow): Notepad {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPage(row: NotepadPageRow): NotepadPage {
  return {
    id: row.id,
    notepadId: row.notepad_id,
    pageNumber: row.page_number,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const notepadRepository = {
  async findByUserId(userId: number): Promise<Notepad | null> {
    const result = await pool.query(
      `SELECT * FROM notepad WHERE user_id = $1`,
      [userId]
    )
    return result.rows[0] ? mapNotepad(result.rows[0]) : null;
  },

  async getOrCreateForUser(userId: number): Promise<Notepad> {
    const existing = await this.findByUserId(userId);
    if (existing) return existing;
    return this.createNotepad(userId);
  },

  async createNotepad(userId: number): Promise<Notepad> {
    const result = await pool.query(
      `INSERT INTO notepad (user_id) VALUES ($1) RETURNING *`, [userId]
    )
    return mapNotepad(result.rows[0]);
  },

  async getPages(notepadId: number): Promise<NotepadPage[]> {
    const result = await pool.query(
      `SELECT * FROM notepad_page where notepad_id = $1 ORDER BY page_number ASC`, [notepadId]
    )
    return result.rows.map(mapPage);
  },

  async getPage(notepadId: number, pageNumber: number): Promise<NotepadPage | null> {
    const result = await pool.query(
      `SELECT * FROM notepad_page WHERE notepad_id = $1 AND page_number = $2`, [notepadId, pageNumber]
    )
    return result.rows[0] ? mapPage(result.rows[0]) : null;
  },

  async createPage(notepadId: number, input: CreatePageInput): Promise<NotepadPage> {
    // check for page limit
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM notepad_page WHERE notepad_id = $1`, [notepadId]
    );
    if (parseInt(countResult.rows[0].count) >= 50) {
      throw new Error('Maximum page limit (50) reached');
    }

    const result = await pool.query(
      `INSERT INTO notepad_page (notepad_id, page_number, title, content) VALUES ($1, $2, $3, $4) RETURNING *`, [notepadId, input.pageNumber, input.title ?? 'Untitled', input.content ?? '']
    );
    return mapPage(result.rows[0]);
  },

  async updatePage(notepadId: number, pageNumber: number, input: UpdatePageInput): Promise<NotepadPage | null> {
    const result = await pool.query(
      `UPDATE notepad_page
      SET title = COALESCE($3, title),
        content = COALESCE($4, content)
      WHERE notepad_id = $1 AND page_number = $2 RETURNING *`, [notepadId, pageNumber, input.title, input.content]
    );
    return result.rows[0] ? mapPage(result.rows[0]) : null;
  },

  // upsert (update or insert - create page)
  async upsertPage(notepadId: number, pageNumber: number, input: UpdatePageInput): Promise<NotepadPage> {
    const existing = await this.getPage(notepadId, pageNumber);
    if (!existing) {
      const count = await pool.query(
        `SELECT COUNT(*) FROM notepad_page WHERE notepad_id = $1`, [notepadId]
      );
      if (parseInt(count.rows[0].count) >= 50) {
        throw new Error('Maximum page limit (50) reached');
      }
    }
    const result = await pool.query(
      `INSERT INTO notepad_page (notepad_id, page_number, title, content)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (notepad_id, page_number)
      DO UPDATE SET
        title = COALESCE(EXCLUDED.title, notepad_page.title),
        content = COALESCE(EXCLUDED.content, notepad_page.content)
      RETURNING *`, [notepadId, pageNumber, input.title ?? 'Untitled', input.content ?? '']
    );
    return mapPage(result.rows[0]);
  },

  async deletePage(notepadId: number, pageNumber: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM notepad_page WHERE notepad_id = $1 AND page_number = $2`, [notepadId, pageNumber]
    )
    return (result.rowCount ?? 0) > 0;
  }
}

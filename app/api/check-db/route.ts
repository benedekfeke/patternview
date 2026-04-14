import { auth0 } from '@/lib/auth0';
import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth0.getSession();
    if (!session?.user?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results: any = {
      connection: false,
      tables: [],
      userprofile: { exists: false, count: 0 },
      notepad: { exists: false, count: 0 },
      notepad_page: { exists: false, count: 0 },
      diagnosis: '',
    };

    // Test connection
    try {
      const timeResult = await pool.query('SELECT NOW()');
      results.connection = true;
      results.timestamp = timeResult.rows[0].now;
    } catch (error: any) {
      return NextResponse.json({ 
        error: 'Connection failed', 
        message: error.message 
      }, { status: 500 });
    }

    // Check all tables
    const tables = await pool.query(`
      SELECT schemaname, tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    results.tables = tables.rows.map(r => r.tablename);

    // Check userprofile table
    const userprofileCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'userprofile'
      ) as exists
    `);
    results.userprofile.exists = userprofileCheck.rows[0].exists;
    
    if (results.userprofile.exists) {
      const count = await pool.query('SELECT COUNT(*) FROM userprofile');
      results.userprofile.count = parseInt(count.rows[0].count);
    }

    // Check notepad table
    const notepadCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'notepad'
      ) as exists
    `);
    results.notepad.exists = notepadCheck.rows[0].exists;
    
    if (results.notepad.exists) {
      const count = await pool.query('SELECT COUNT(*) FROM notepad');
      results.notepad.count = parseInt(count.rows[0].count);
    }

    // Check notepad_page table
    const notepadPageCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'notepad_page'
      ) as exists
    `);
    results.notepad_page.exists = notepadPageCheck.rows[0].exists;
    
    if (results.notepad_page.exists) {
      const count = await pool.query('SELECT COUNT(*) FROM notepad_page');
      results.notepad_page.count = parseInt(count.rows[0].count);
    }

    // Diagnosis
    if (results.tables.length === 0) {
      results.diagnosis = 'Database is empty. Run pgTableCreation.sql in Neon SQL Editor.';
    } else if (!results.userprofile.exists) {
      results.diagnosis = 'userprofile table missing. Run pgTableCreation.sql in Neon SQL Editor.';
    } else {
      results.diagnosis = 'Database schema looks good!';
    }

    return NextResponse.json(results, { status: 200 });

  } catch (error: any) {
    console.error('Database check error:', error);
    return NextResponse.json({ 
      error: 'Check failed', 
      message: error.message,
      code: error.code 
    }, { status: 500 });
  }
}

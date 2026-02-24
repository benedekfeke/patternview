import {GoogleGenerativeAI} from '@google/generative-ai';

export interface Book {
  title: string,
  first_publish_year?: number,
}

const genAi = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

async function fetchBooksGemini(authorName: string): Promise<Book[]> {
  try {
    const model = genAi.getGenerativeModel({model: 'gemini-2.5-flash'});
    const prompt = `List the 3 most famous books by author "${authorName}". 
    Return ONLY a JSON array in this exact format, no markdown, no explanation:
    [{"title": "Book Title", "first_publish_year": 2000}]
    If you don't know the exact year, use null.`;

    const respone = await model.generateContent(prompt);
    const response = respone.response;
    const text = response.text();

    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const books = JSON.parse(jsonMatch[0]);
      return books.slice(0, 3);
    }
    return [];
  } catch (error) {
    console.error("Could not fetch books from Gemini", error);
    return [];
  }
}

export async function fetchAuthorBooks(authorName: string): Promise<Book[]> {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?author=${encodeURIComponent(authorName)}&limit=3&sort=rating`
    );
    const data = await response.json();
    const books =  data.docs?.slice(0,3).map((doc:any) => ({
      title: doc.title,
      first_publish_year: doc.first_publish_year
    })) || [];

    if (books.length > 0) {
      console.log('[OpenLibrary] Found books: ', books);
      return books;
    }
    console.log('[FetchUtil]: trying Gemini api');
    const geminiBooks = await fetchBooksGemini(authorName);
    console.log("[Gemini] found books:", geminiBooks);
    return geminiBooks;
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];  
  }
}

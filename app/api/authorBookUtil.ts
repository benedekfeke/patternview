import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Book {
  title: string;
  first_publish_year?: number;
}

const OPEN_LIBRARY_TIMEOUT_MS = 5000;
const GEMINI_TIMEOUT_MS = 7000;
const BOOKS_LIMIT = 3;

async function fetchBooksGemini(authorName: string): Promise<Book[]> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return [];
    }

    const genAi = new GoogleGenerativeAI(apiKey);
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `List the 3 most famous books by author "${authorName}". 
    Return ONLY a JSON array in this exact format, no markdown, no explanation:
    [{"title": "Book Title", "first_publish_year": 2000}]
    If you don't know the exact year, use null.`;

    const responseResult = await withTimeout(
      model.generateContent(prompt),
      GEMINI_TIMEOUT_MS,
      "Gemini request timed out"
    );

    const response = responseResult.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const books = JSON.parse(jsonMatch[0]);
      if (Array.isArray(books)) {
        return books.map(normalizeBook).filter(Boolean).slice(0, BOOKS_LIMIT) as Book[];
      }
    }

    return [];
  } catch (error) {
    console.error("Could not fetch books from Gemini", error);
    return [];
  }
}

export async function fetchAuthorBooks(authorName: string): Promise<Book[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPEN_LIBRARY_TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?author=${encodeURIComponent(authorName)}&limit=${BOOKS_LIMIT}&sort=rating`,
        {
          signal: controller.signal,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const docs = Array.isArray(data?.docs) ? data.docs : [];

        const books = docs
          .slice(0, BOOKS_LIMIT)
          .map((doc: any) => normalizeBook(doc))
          .filter(Boolean) as Book[];

        if (books.length > 0) {
          return books;
        }
      }
    } finally {
      clearTimeout(timeout);
    }

    const geminiBooks = await fetchBooksGemini(authorName);
    return geminiBooks;
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return fetchBooksGemini(authorName);
  }
}

function normalizeBook(raw: any): Book | null {
  const title = typeof raw?.title === "string" ? raw.title.trim() : "";
  if (!title) {
    return null;
  }

  const yearRaw = raw?.first_publish_year;
  const first_publish_year = Number.isInteger(yearRaw) ? yearRaw : undefined;

  return {
    title,
    first_publish_year,
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(message)), timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeout);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

'use client'
import { Button } from '@/app/components/button';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { useState } from 'react';
import NotepadModal from './NotepadModal';

type User = {
  sub?: string,
  email?: string,
  username?: string,
  isAdmin?: boolean
};

export default function HeaderClient({user}: {user: User | null}) {
  const [isNotepadOpen, setIsNotepadOpen] = useState<boolean>(false);

  const handleSync = async () => {

    if (!user?.sub || !user?.email) return;

    try {
      const res = await fetch('/api/users/sync', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"},
        body: JSON.stringify({
          sub: user?.sub,
          email: user?.email,
          username: user?.username
        })
        
      });

      if (!res.ok) {
        throw new Error("Failed to sync user");
      }
    } catch (e) {
      console.error("Failed to sync user:", e);
    }

  }

  // TODO: make sync automatic->> Auth0 dashboard Trigger when public domain will be available.
  // For local testing, use the button below

  return (
    <div className='w-full font-[family-name:var(--font-sf)] pointer-events-auto bg-black'>

    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-14 w-full shrink-0 items-center px-4 md:px-6 lg:px-8">
        <Link href="/" className="mr-6 pt-5 pb-5 hidden lg:flex" prefetch={false}>
        <Image src={'/logo-plain-noback.png'}
              width={32}
              height={32}
              alt='main logo'
              className='z-10'
              />
        </Link>
        <div className=" ml-auto flex gap-2">

          {/* notepad -modal */}
          {user && (
            <Button onClick={() => setIsNotepadOpen(true)}
            className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 hover:bg-white/30 transition-all duration-300 hover:rounded-none"
            >
              <BookOpen size={16} className='mr-2' />
              Notepad
            </Button>

          )}

          {/* These links have their own backgrounds and will appear on top of the Dither component */}
          {user?.isAdmin && (
          <Link
            href="/dashboard"
            className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 hover:bg-white/30 transition-all duration-300 hover:rounded-none"
            prefetch={false}
            >
            Dashboard
          </Link>)}
          <Link
            href={`/test`}
            className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 hover:bg-white/30 transition-all duration-300 hover:rounded-none"
            prefetch={false}
            >
            TestPage
          </Link>
          <Button
            onClick={handleSync}
            className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 hover:bg-white/30 transition-all duration-300 hover:rounded-none"
            >
            Sync with local DB
          </Button>
          {!user && (
            <Link
            href="/auth/login"
            className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 hover:bg-white/30 transition-all duration-300 hover:rounded-none"
            prefetch={false}
            >
              Login
            </Link>
          )}
          {user && (
            <>
              <Link
                href="/profile"
                className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 hover:bg-white/40 transition-all duration-300 hover:rounded-none"
                >
                Profile
              </Link>
              <Link
                href="/auth/logout"
                className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 hover:bg-white/30 transition-all duration-300 hover:rounded-none"
                >
                Logout
              </Link>
            </>
          )}
        </div>
      </header>
    </div>

    {/* Notepad modal - render with portal */}
    {user && (
      <NotepadModal isOpen={isNotepadOpen} onClose={() => setIsNotepadOpen(false)}/>
    )}

    </div>
  )
}


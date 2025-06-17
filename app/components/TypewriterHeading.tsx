'use client';

import { useEffect, useState } from 'react';

export default function TypewriterHeading({ text, className = "" }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length && !isDeleting) {

      const typingSpeed = Math.floor(Math.random() * 40) + 80;

      const timeout = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
      if (currentIndex + 1 === text.length) {
        setIsDeleting(true);
      }
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
        if (currentIndex - 1 === 1) {
          setIsDeleting(false);
        }
      }, 70); // Deleting speed - adjust as needed
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, isDeleting]);

  return (
    <h2 className={`${className} flex justify-center m-10 text-3xl font-light text-primary min-h-[1rem]`}>
      <span>{displayText || '\u00A0'}</span>
      <span className="border-r-2 border-primary ml-1 animate-cursor"></span>
    </h2>
  );
}

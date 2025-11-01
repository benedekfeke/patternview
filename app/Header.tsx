
import Image from 'next/image';
import Link from "next/link";

export default function Header() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 font-[family-name:var(--font-sf)] pointer-events-auto">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Link href="/" className="mr-6 pt-5 pb-5 hidden lg:flex" prefetch={false}>
        <Image src={'/logo-plain-noback.png'}
              width={32}
              height={32}
              alt='main logo'
              className='z-10'
        />
        </Link>
        <div className=" ml-auto flex gap-2">
          {/* These links have their own backgrounds and will appear on top of the Dither component */}
          <Link
            href="#"
            className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-md bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 transition-colors hover:bg-white/20"
            prefetch={false}
          >
            Home
          </Link>
          <Link
            href={`/test`}
            className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-md bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 transition-colors hover:bg-white/20"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="#"
            className="z-10 group inline-flex h-9 w-max items-center justify-center rounded-md bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-50 transition-colors hover:bg-white/20"
            prefetch={false}
          >
            Contact
          </Link>
        </div>
      </header>
    </div>
  )
}


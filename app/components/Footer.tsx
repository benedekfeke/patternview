export default function Footer() {
  return (
    <footer className="h-12 flex items-center justify-center bg-black/80 text-white text-sm z-10">
      &copy; {new Date().getFullYear()} PatternView. All rights reserved.
    </footer>
  );
}

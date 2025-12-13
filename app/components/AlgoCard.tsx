'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import Link from "next/link";
import {Lock} from 'lucide-react';
import { useCallback, useState } from "react";

interface AlgoCardProps {
  lottie?: string;
  slug: string;
  name: string;
  isLoggedIn: boolean;
}

export default function AlgoCard({lottie, slug, name, isLoggedIn}: AlgoCardProps) {

  const [isHovered, setIsHovered] = useState(false);
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null)

  const dotLottieRefCallback = useCallback((instance: DotLottie | null) => {
    setDotLottie(instance);
  }, []);

  return (
    <Card className="relative z-10 max-w-52 hover:mx-12 max-h-100 transition-all duration-200 hover:bg-blue-300/30 hover:text-card bg-accent/20 text-card-foreground backdrop-blur-xl pointer-events-auto overflow-hidden"
    onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <CardTitle className="z-10 text-center text-2xl font-bold">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          {/* Lottie animation */}
          {lottie && (
            <div className={`z-0 w-full h-full object-cover rounded-full transition-all duration-200 ease-in-out bg-`}>
              <DotLottieReact src={lottie} loop dotLottieRefCallback={dotLottieRefCallback}
              onMouseEnter={() => dotLottie?.play()}
              onMouseLeave={() => dotLottie?.pause()}  
              className="w-full my-4 h-full object-cover hover:scale-200 transition-all"/>
            </div>
            
          )}
        </div>
      </CardContent>
      <CardFooter className="z-10 transition-all duration-150 ease">
        {isLoggedIn ? (
          <Link href = {`algorithms/${slug}`} className="w-full">
            <Button className="w-full bg-purple-300 text-black hover:cursor-pointer hover:bg-purple-800 hover:text-white transition-all duration-100">
              View Algorithm
            </Button>
          </Link>
        ) : (
          <div className="w-full flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Lock size={16} />
              <span>Locked</span>
            </div>
            <Link href="/auth/login" className="w-full">
              <Button className="w-full bg-gray-500 text-white hover:cursor-pointer hover:bg-gray-600 transition-all duration-100">
                Log in to access
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

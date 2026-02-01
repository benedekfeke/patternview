'use client'
import { Button } from "@/app/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/app/components/card";
import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Lock } from 'lucide-react';
import Link from "next/link";
import { useCallback, useState } from "react";

interface AlgoCardProps {
  lottie?: string;
  slug: string;
  name: string;
  isLoggedIn: boolean;
}

export default function AlgoCard({lottie, slug, name, isLoggedIn}: AlgoCardProps) {

  const [isHovered, setIsHovered] = useState(false);
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  const [rotation, setRotation] = useState({x: 0, y:0});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width /2;
    const centerY = card.height /2;

    const rotateX = (y - centerY) / 6;
    const rotateY = (centerX - x) / 6;
    setRotation({x: rotateX, y: rotateY});
  };

  const resetRotation = () => setRotation({x: 0, y: 0});

  const dotLottieRefCallback = useCallback((instance: DotLottie | null) => {
    setDotLottie(instance);
  }, []);

  return (
    <Card style={{
      transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,transition: "all 0.4s ease-out", willChange: "transform"
    }} 
    className={`relative max-w-60 rounded-4xl hover:mx-12 max-h-100 hover:text-card text-card-foreground hover:rounded-none pointer-events-auto overflow-hidden bg-white/30 ${isLoggedIn ? "hover:bg-radial-[at_50%_85%] from-sky-200 via-purple-400 to-gray-800 to-90% hover:opacity-100" : ""}`}
    onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => {setIsHovered(false); resetRotation()}}
    onMouseMove={handleMouseMove}

    >
      <CardHeader className="[transform:translateZ(50px)]">
        <CardTitle className=" text-center text-2xl font-bold">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          {/* Lottie animation */}
          {lottie && (
            <div className={`w-full h-full object-cover transition-all duration-200 ease-in-out`}>
              <DotLottieReact src={lottie} loop dotLottieRefCallback={dotLottieRefCallback}
              onMouseEnter={() => dotLottie?.play()}
              onMouseLeave={() => dotLottie?.pause()}  
              className="w-full my-4 h-full object-cover transition-all"/>
            </div>
            
          )}
        </div>
      </CardContent>
      <CardFooter className=" transition-all duration-150 ease">
        {isLoggedIn ? (
          <Link href = {`algorithms/${slug}`} className="w-full">
            <Button className="w-full bg-purple-300 text-black hover:cursor-pointer hover:bg-purple-800 hover:text-white hover:rounded-none transition-all duration-200 hover:shadow-xl hover:shadow-black hover:border-white hover:border-2">
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
              <Button className="w-full bg-gray-500 text-white hover:cursor-pointer hover:bg-gray-600 hover:rounded-none transition-all duration-100">
                Log in to access
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

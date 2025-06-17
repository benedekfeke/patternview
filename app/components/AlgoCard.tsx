import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function AlgoCard({image, slug, name}: {image: string, slug:string, name:string}) {
  return (
    <Card className="w-52 max-h-100 transition-colors duration-300 hover:bg-card-foreground hover:text-card bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <img
            src={image}
            alt={name}
            className="w-28 h-28 object-cover rounded-full transition-all duration-300 ease-in-out hover:scale-140 hover:shadow-lg"
          />
        </div>
        <div className="text-center mt-4">
          <a href={`/algorithms/${slug}`} className="text-blue-500 hover:underline">
          </a>
        </div>
      </CardContent>
      <CardFooter className="transition-all duration-150 ease hover:scale-110">
        <a href={`/algorithms/${slug}`} className="w-full">
          <Button className="w-full hover:cursor-crosshair">
            View Algorithm
          </Button>
        </a>
      </CardFooter>

    </Card>
  );
}

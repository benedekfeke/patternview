import { getAlgorithmConfig } from "@/src/domain/algorithm/algorithm.registry";
import AlgorithmVisualizer from "./AlgorithmVisualizer";

export default async function AlgorithmPage({ params }: { 
  params: Promise<{ slug: string }> 
}) {
  // Nextjs 15 introduces async params on dynamic routes, hence we need await
  const { slug } = await params;
  const config = getAlgorithmConfig(slug);

  return (
    <div className="flex-1 flex flex-col bg-black">

      <div className="flex-1 flex items-center justify-center pb-4">
        {config ? (
          <div className="w-full h-full max-w-7xl">
            <AlgorithmVisualizer config={config} className="w-full h-full" />
          </div>
        ) : (
          <p className="text-white text-xl">Algorithm "{slug}" is not implemented yet.</p>
        )}

      </div>
    </div>
  );
}

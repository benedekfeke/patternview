import AlgorithmVisualizer from "./AlgorithmVisualizer";
import { pathfindingConfig } from "./configs/pathfindingConfig";
import { queueConfig } from "./configs/queueConfig";

const algorithmConfigs: Record<string, any> = {
  queue: queueConfig,
  pathfinding: pathfindingConfig,
  //add more as needed
};

export default async function AlgorithmPage({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  const config = algorithmConfigs[awaitedParams.slug];

  return (
    <div className="flex-1 flex flex-col bg-black">

      <div className="flex-1 flex items-center justify-center pb-4">
        {config ? (
          <div className="w-full h-full max-w-7xl">
            <AlgorithmVisualizer config={config} className="w-full h-full" />
          </div>
        ) : (
          <p className="text-white text-xl">Algorithm {awaitedParams.slug} is not implemented yet.</p>
        )}

      </div>

      
    </div>
  );
}

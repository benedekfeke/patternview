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
    <div className="min-h-screen bg-blue-400">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
        Algorithm: {awaitedParams.slug}
      </h1>
      {config ? (
        <AlgorithmVisualizer config={config} className="w-full h-full" />
      ) : (
        <p>Algorithm {awaitedParams.slug} is not implemented yet.</p>
      )}
      
    </div>
  );
}

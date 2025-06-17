import QueueVisualizer from "./QueueVisualizer";
export default async function AlgorithmPage({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 capitalize">Algorithm: {awaitedParams.slug}</h1>
      {awaitedParams.slug === 'queue' ? (
      <QueueVisualizer className="w-full h-full"/>
      ) : (
      <p>Algorithm {awaitedParams.slug} is not implemented yet.</p>
      )}
      
    </>
  );
}

// export async function generateStaticParams() {
//   // Return an array of possible slugs for static generation, or leave empty for full dynamic
//   return [];
// }

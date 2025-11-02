import Color from 'color';
import AlgoCard from './components/AlgoCard';

import Dither from '@/components/Dither';



const algorithms = [
  {
    slug: "queue",
    name: "Queue",
    image: "/bubble_sort.png", // Add your image assets to public/
  },
  {
    slug: "quick-sort",
    name: "Quick Sort",
    image: "/quick_sort.jpg",
  },
  {
    slug: "merge-sort",
    name: "Merge Sort",
    image: "/quick_sort.jpg",
  },
  // Add more algorithms as needed
];



export default function Home() {

  const darkMode = true;

  let color = Color("#A259F7"); // Vibrant purple

  let color1 = Color("#B71C1C").darken(0.2).saturate(2); // dark vivid red
  let color2 = Color("#0D47A1").darken(0.2).saturate(2); // dark vivid blue
  let color3 = Color("#C62828").darken(0.2).saturate(2.2); // deep hot red
  let color4 = Color("#1565C0").darken(0.2).saturate(2.2); // deep electric blue
  let color5 = Color("#B71C1C").darken(0.4).saturate(2.2); // very dark neon red
  let color6 = Color("#0D47A1").darken(0.4).saturate(2.2); // very dark vivid blue
  let color7 = Color("#1976D2").darken(0.2).saturate(2); // dark sky blue
  let radius = 100;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Dither Background: Fixed position to stay in the background */}
      <div className="fixed inset-0 z-0">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.53}
          waveFrequency={2}
          waveSpeed={0.05}
        />
      </div>

      {/* Main Content: Positioned relatively to sit on top of the background */}
      <div className="relative pointer-events-none">
        <div className="w-full max-w-screen-2xl mx-auto p-2 md:p-8 lg:p-12 font-[family-name:var(--font-sf)]">
          {/* <TypewriterHeading
            text="Currently implemented algorithms"
            className="text-3xl font-bold text-white mb-12 text-center"
          /> */}
          <div className='w-full p-5 font-extrabold justify-self-center text-center text-8xl text-accent  '>
            <h1 className='z-10'>
              PatternView
            </h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 md:gap-8 w-full">
            <div className="col-span-full flex flex-wrap justify-center gap-5 md:gap-8">
              {algorithms.map((algo) => (
                <AlgoCard
                  key={algo.slug} 
                  slug={algo.slug} 
                  image={algo.image} 
                  name={algo.name} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

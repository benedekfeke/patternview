import Color from 'color';
import AlgoCard from './components/AlgoCard';
import ParticleBackground from './components/ParticleBackground';
import TypewriterHeading from './components/TypewriterHeading';


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
    <div style={{ position: "relative", overflowX: 'hidden' }}>
      <ParticleBackground darkMode={darkMode} />
      {/* <Goo intensity='strong' style={{ position: "absolute", inset: 0, zIndex: -1, width: "100%", height: "100vh", overflow: "unset", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100vh" }}>
          <svg
            role="img"
            aria-label="Example of a gooey effect"
            className="w-full h-dvh"
            style={{ display: "block", margin: "auto" }}
          >
            <g style={{ animation: "rotate_back 9s linear infinite" }}>
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                fill={color1.toString()}
                style={{
                  animation: "blob_four 20s ease-in-out -3s infinite alternate"
                }}
              />
              <circle
                cx="50%"
                cy="50%"
                r={Math.floor(radius * 0.75)}
                fill={color2.toString()}
                style={{
                  animation: "blob_three 15s ease-in-out -3s infinite alternate"
                }}
              />
              <circle
                cx="50%"
                cy="50%"
                r={Math.floor(radius * 0.64)}
                fill={color3.toString()}
                style={{
                  animation: "blob_two 6s ease-in-out -3s infinite alternate"
                }}
              />
              <circle
                cx="50%"
                cy="50%"
                r={Math.floor(radius * 0.49)}
                fill={color4.toString()}
                style={{
                  animation: "blob_one 9s ease-in-out -3s infinite alternate"
                }}
              />
              <circle
                cx="50%"
                cy="50%"
                r={Math.floor(radius * 0.98)}
                fill={color5.toString()}
                style={{
                  animation: "blob_five 9s ease-in-out -3s infinite alternate"
                }}
              />
              <circle
                cx="50%"
                cy="50%"
                r={Math.floor(radius * 0.27)}
                fill={color6.toString()}
                style={{
                  animation: "blob_six 9s ease-in-out -3s infinite alternate"
                }}
              />
              <circle
                cx="50%"
                cy="50%"
                r={Math.floor(radius * 0.39)}
                fill={color7.toString()}
                style={{
                  animation: "blob_seven 9s ease-in-out -3s infinite alternate"
                }}
              />
            </g>
          </svg>
        </div>
      </Goo> */}
        <div className="w-full max-w-screen-2xl mx-auto p-2 md:p-8 lg:p-12 font-[family-name:var(--font-sf)]">
        {/* <h2 className="text-3xl font-bold mb-12 text-center">Available algorithms</h2> */}
        <TypewriterHeading
        text="Currently implemented algorithms"
        className="text-3xl font-bold color-mb-12 text-center"/>
        
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
  );
}

'use client';
import DescriptionModal, { DescriptionSegment } from '@/app/components/DescriptionModal';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Unity } from 'react-unity-webgl';
import { useSharedUnity } from '../UnityProvider';

interface AlgorithmConfig {
  sceneName: string,
  title: string,
  description: string,
  modalDescription?: DescriptionSegment[],
  operations: string[],
  pseudocodes: Array<{title: string; code: string}>;
  explanationRules?: {
    empty: string;
    hasItems: string;
    default: string;
  };
}

interface AlgorithmVisualizerProps {
  config: AlgorithmConfig,
  className?: string;
}

function AlgorithmVisualizer({config, className='w-full h-full'} : AlgorithmVisualizerProps) {
  const unityContext = useSharedUnity();
  
  const [score, setScore] = useState(1);
  const [explanation, setExplanation] = useState<string>("");
  const [snippet, setSnippet] = useState<string>("");
  const [showSnippet, setShowSnippet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState<string>('');

  //TODO: solve dynamic explanations for each algorithm
  const getExplanation = useCallback((score: number): string => {
    if (!config.explanationRules) return "No explanation available";
    
    if (score === 0) {
      return config.explanationRules.empty;
    }
    if (score >= 1 && score <= 10) {
      return config.explanationRules.hasItems;
    }
    return config.explanationRules.default;
  }, [config.explanationRules]);

  //load the specific scene based on sceneName
  useEffect( () => {

    //only load scene if we're switching to a different scene
    if (currentScene === config.sceneName) {
      console.log(`Already on scene; ${config.sceneName}`);
      return;
    }

    const loadScene = async() => {
      try {

        if (!unityContext.isLoaded) {
          console.log("Unity is not loaded yet, waiting...");
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`attempting to load scene: ${config.sceneName}`);
        unityContext.sendMessage('SceneManager', 'LoadSceneByName', config.sceneName);
        
        await new Promise(resolve => setTimeout(resolve, 500));

        setCurrentScene(config.sceneName);
        setIsLoaded(true);
        
      } catch (error) {
        console.log(`Failed to load ${config.sceneName} scene: `, error);
      }
    };

    loadScene();
  }, [unityContext, unityContext.isLoaded, config.sceneName]);

  // handlers - e.g. enqueue has idx = 0, dequeue has idx= 1
  const handleOperation = useCallback((operationIndex: number) => (...parameters: any[]) => {
    //update score based on operation
    setScore(prevScore => {
      const newScore = operationIndex === 0 ? prevScore + 1 : prevScore - 1;

      //use the calculated value immediately
      setExplanation(getExplanation(newScore));
      setSnippet(config.pseudocodes[operationIndex].code);
      setShowSnippet(true);
      
      return newScore;
      }
    );
  }, [config, getExplanation]);
  
  //register dispatch events from unity with handlers
  useEffect(() => {
    const handlers = config.operations.map((operation, index) => ({
      event: operation,
      handler: handleOperation(index)
    }));

    handlers.forEach(({event, handler}) => {
      unityContext.addEventListener(event, handler);
    })

    console.log("event listeners registered");

    return () => {
      handlers.forEach(({event, handler}) => {
        unityContext.removeEventListener(event, handler);
      });
    }
  }, [unityContext, config.operations, handleOperation]);

  //return the component
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {!isLoaded && (
        <div className='flex items-center justify-center h-full text-white'>
          Loading {config.title}... {Math.round(unityContext.loadingProgression * 100)}%
        </div>
      )}

      <div className="flex flex-row flex-1 gap-4 pointer-events-auto">
        {/* Unity container - 4:3 aspect ratio (Game) */}
        <div className="flex-1 flex items-center justify-center">
          <div className='relative w-full h-0 pb-[75%] max-h-[calc(100vh-200px)]'>
            <div className='absolute inset-0 rounded-2xl overflow-hidden shadow-lg'>
              <Unity 
                unityProvider={unityContext.unityProvider} 
                className={`w-full h-full pointer-events-auto ${isLoaded ? 'block' : 'hidden'}`}
              />
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex flex-col gap-3 pointer-events-auto">
          {/* Explanation Panel */}
          <div className="p-4 rounded-2xl text-white border-2 border-white/30 bg-black/50 backdrop-blur-sm font-mono">
            <p>{explanation}</p>
            {showSnippet && (
              <p className="text-white mt-2 text-sm font-mono"
                dangerouslySetInnerHTML={{ __html: snippet }}
              />
            )}
          </div>
          
          {/* Description Panel */}
          <div className="flex-1 overflow-y-auto p-4 rounded-2xl text-white font-[family-name:var(--font-sf)] border-white/30 bg-white/10 backdrop-blur-sm">
            <h2 className='text-lg font-bold mb-2'>{config.title}</h2>
            <p className='text-sm' dangerouslySetInnerHTML={{ __html: config.description }} />
            <br/>
            <ul className="list-disc pl-5 text-sm">
              {config.operations.map((op, idx) => (
                <li key={idx}>{op}: {config.pseudocodes[idx]?.title || 'Operation'}</li>
              ))}
            </ul>

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 transition-all duration-300 cursor-pointer border border-white/30"
            >
              More Info
            </Button>
          </div>
        </div>
        
        {/* Modal Portal */}
        {isModalOpen && createPortal(
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn pointer-events-none"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-black/50 rounded-2xl p-6 max-h-[80vh] w-[600px] max-w-[90vw] overflow-y-auto animate-fadeIn border-1 border-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pointer-events-auto">
                <h2 className="text-2xl font-bold text-accent border-1 rounded-4xl px-4">{config.title}</h2>
                <Button size={'sm'} className='rounded-4xl w-max hover:cursor-pointer hover:text-destructive hover:shadow-destructive' variant={'outline'} onClick={() => setIsModalOpen(false)}>×</Button>
              </div>
              <div className="text-black pointer-events-auto">
                {config.modalDescription ? (
                  <DescriptionModal segments={config.modalDescription} />
                ) : (
                  <p>Additional information about {config.title}...</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}

export default AlgorithmVisualizer;

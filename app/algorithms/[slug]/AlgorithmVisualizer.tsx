'use client';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Unity } from 'react-unity-webgl';
import { useSharedUnity } from '../UnityProvider';

interface AlgorithmConfig {
  sceneName: string,
  title: string,
  description: string,
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
  
  const [score, setScore] = useState(0);
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
    const newScore = parameters[0] as number;

    //update score based on operation
    setScore(operationIndex === 0 ? prev => prev + 1 : prev => prev -1);
    setExplanation(getExplanation(newScore));
    setSnippet(config.pseudocodes[operationIndex].code);

    setShowSnippet(true);

    setTimeout(() => {
      setShowSnippet(false)
    }, 2000);
  }, [config]);
  
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
    <>
      {!isLoaded && (
        <div className='flex items-center justify-center h-full text-white'>
          Loading {config.title}... {Math.round(unityContext.loadingProgression * 100)}%
        </div>
      )}

      <div className="flex flex-row m-2 h-fit space-x-2 rounded-2xl shadow-lg max-h-screen pointer-events-auto">
        <div className="basis-2/3 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
          <Unity 
            unityProvider={unityContext.unityProvider} 
            className={`w-full h-full pointer-events-auto ${isLoaded ? 'block' : 'hidden'}`}
          />
        </div>
        <div className="basis-1/3 rounded-2xl flex flex-col space-y-2 pointer-events-auto">
          <div className="basis-1/3 p-2 rounded-2xl text-white border-2 border-white bg-black/50">
            <p>{explanation}</p>
            {showSnippet && (
              <p
                className="text-white mt-2"
                dangerouslySetInnerHTML={{ __html: snippet }}
              />
            )}
          </div>
          
          <div className="basis-2/3 overflow-y-auto p-4 rounded-2xl text-black font-[family-name:var(--font-sf)] border-2 border-white bg-blue-500">
            <p dangerouslySetInnerHTML={{ __html: config.description }} />
            <br/>
            <ul className="list-disc pl-5">
              {config.operations.map((op, idx) => (
                <li key={idx}>{op}: {config.pseudocodes[idx]?.title || 'Operation'}</li>
              ))}
            </ul>

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="relative bottom-1 left-0 bg-red-900 rounded-2xl p-1 mt-4 hover:bg-amber-300 transition-all duration-300 cursor-pointer"
            >
              More Info
            </Button>
          </div>
        </div>
        {/* Modal Portal */}
        {isModalOpen && createPortal(
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn pointer-events-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-white rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">{config.title}</h2>
                <Button size={'sm'} variant={'outline'} onClick={() => setIsModalOpen(false)}>×</Button>
              </div>
              {/* TODO: ADD MODAL-DESCRIPTION OVERLAYS (Maybe a horizontal scrolling with button??) */}
              <div className="text-black">
                <p>Additional information about {config.title}...</p>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
}

export default AlgorithmVisualizer;

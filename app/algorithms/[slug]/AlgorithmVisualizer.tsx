'use client';
import DescriptionModal from '@/app/components/DescriptionModal';
import { Button } from '@/app/components/button';
import '@/app/components/css/reactTooltip.css';
import { useSharedUnity } from '@/src/adapters/unity/UnityProvider';
import { AlgorithmState } from '@/src/domain/algorithm/algorithm.handler';
import { AlgorithmConfig } from '@/src/domain/algorithm/algorithm.types';
import { getAlgorithmHandler } from '@/src/domain/algorithm/handler.registry';
import DOMPurify from 'dompurify';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { Unity } from 'react-unity-webgl';
interface AlgorithmVisualizerProps {
  config: AlgorithmConfig,
  className?: string;
}

function AlgorithmVisualizer({config, className='w-full h-full'} : AlgorithmVisualizerProps) {
  const unityContext = useSharedUnity();

  const handler = useMemo(() => getAlgorithmHandler(config.sceneName), [config.sceneName]); 

  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>(handler?.initialState ?? {});
  

  const [explanation, setExplanation] = useState<string>("");
  const [snippet, setSnippet] = useState<string>("");
  const [snippetTooltip, setSnippetTooltip] = useState<string>("Not defined");
  const [showSnippet, setShowSnippet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState<string>('');

  useEffect(() => {
    if (handler) {
      setAlgorithmState(handler.initialState);
      setExplanation(handler.getExplanation(handler.initialState));
    }
  }, [handler]);

  //load the specific scene based on sceneName
  useEffect( () => {

    //only load scene if we're switching to a different scene
    if (currentScene === config.sceneName) {
      console.log(`Already on scene; ${config.sceneName}`);
      return;
    }

    // TODO: Send message with zip codes(5 digit numbers to init letters)
    if (config.sceneName === 'RadixSort') {
      // unityContext.sendMessage("")
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

  // 
  const handleOperation = useCallback((operationName: string) => (...params: any[]) => {
    if (!handler) {
      console.warn(`No handler found for ${config.sceneName}`);
      return;
    }

    const result = handler.handleOperation(operationName, algorithmState, ...params);
    
    setAlgorithmState(result.newState);
    setExplanation(handler.getExplanation(result.newState));
    
    if (result.snippet) {
      setSnippet(result.snippet);
      setShowSnippet(true);
    }
    if (result.tooltip) {
      setSnippetTooltip(result.tooltip);
    }
  }, [handler, algorithmState, config.sceneName]);
  
  //register dispatch events from unity with handlers
  useEffect(() => {
    const handlers = config.operations.map((operation) => ({
      event: operation,
      handler: handleOperation(operation)
    }));

    handlers.forEach(({event, handler}) => {
      unityContext.addEventListener(event, handler);
    })

    console.log("event listeners registered", config.operations);

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

      <div className="flex flex-row flex-1 gap-4 pointer-events-aut max-h-[90vh]">
        {/* Unity container - 4:3 aspect ratio (Game) */}
        <div className="flex-1 flex items-center justify-center">
          <div className='relative w-full h-0 pb-[75%] max-h-[calc(100vh-100px)]'>
            <div className='absolute inset-0 rounded-2xl overflow-hidden shadow-lg'>
              <Unity 
                unityProvider={unityContext.unityProvider} 
                className={`w-full h-full pointer-events-auto ${isLoaded ? 'block' : 'hidden'}`}
              />
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex flex-col gap-3 pointer-events-auto justify-center overflow-y-auto py-4">
          
          {/* Description Panel */}
          <div className=" p-4 rounded-2xl text-white font-[family-name:var(--font-sf)]  bg-white/10 hover:border-1 hover:rounded-none hover:border-white transition-all duration-200">
            <h2 className='text-lg font-bold mb-2'>{config.title}</h2>
            <p className='text-sm' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(config.description) }} />

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-white/20 hover:bg-black text-white rounded-2xl px-4 py-2 transition-all duration-300 cursor-pointer border border-white/30 hover:rounded-none"
              >
              More Info
            </Button>
          </div>
          {/* Explanation Panel */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-white  text-primary hover:border-2 hover:rounded-none transition-all
          duration-200 overflow-auto">
          <code className=' text-blue-200 text-sm border-b-white/80'>{explanation}</code>
          {showSnippet && (
            <div className='overflow-auto'>
            <pre className="mt-2 border-t border-white/30" 
            data-tooltip-content={`${snippetTooltip}`} 
            data-tooltip-id='my-tooltip' data-tooltip-place='right' data-tooltip-delay-hide={400}>
              <code
                className="text-white mt-2 text-sm "
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(snippet) }}
              />
            </pre>
            <Tooltip id='my-tooltip' clickable className="custom-rt-tooltip"
              classNameArrow="custom-rt-tooltip-arrow" />
            </div>
          )}
          </div>
        </div>
        
        {/* Modal Portal */}
        {isModalOpen && createPortal(
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn pointer-events-none"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-black/50 rounded-2xl p-6 max-h-[80vh] w-auto max-w-[70vw] overflow-y-auto animate-fadeIn border-1 border-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pointer-events-auto">
                <h2 className="text-2xl font-bold text-accent border-1 rounded-2xl px-4">{config.title}</h2>
                <Button size={'sm'} className='rounded-2xl w-max hover:cursor-pointer hover:text-destructive hover:shadow-destructive' variant={'outline'} onClick={() => setIsModalOpen(false)}>×</Button>
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

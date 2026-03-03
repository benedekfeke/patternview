'use client';
import { fetchAuthorBooks } from '@/app/api/authorBookUtil';
import DescriptionModal from '@/app/components/DescriptionModal';
import { Button } from '@/app/components/button';
import '@/app/components/css/reactTooltip.css';
import { useSharedUnity } from '@/src/adapters/unity/UnityProvider';
import { AlgorithmState } from '@/src/domain/algorithm/algorithm.handler';
import { AlgorithmConfig } from '@/src/domain/algorithm/algorithm.types';
import { getAlgorithmHandler } from '@/src/domain/algorithm/handler.registry';
import DOMPurify from 'dompurify';
import { Send, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip } from 'react-tooltip';
import { GoeyToaster, goeyToast } from 'goey-toast';
import 'goey-toast/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Unity } from 'react-unity-webgl';
interface AlgorithmVisualizerProps {
  config: AlgorithmConfig,
  className?: string;
}

function AlgorithmVisualizer({config, className='w-full h-full'} : AlgorithmVisualizerProps) {
  const {
    unityProvider,
    isLoaded: unityIsLoaded,
    loadingProgression,
    addEventListener,
    removeEventListener,
    sendMessage
  } = useSharedUnity();  

  const handler = useMemo(() => getAlgorithmHandler(config.sceneName), [config.sceneName]); 

  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>(handler?.initialState ?? {});
  const [explanation, setExplanation] = useState<string>("");
  const [snippet, setSnippet] = useState<string>("");
  const [snippetTooltip, setSnippetTooltip] = useState<string>("Not defined");
  const [showSnippet, setShowSnippet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScene, setCurrentScene] = useState<string>('');
  const [Zipcodes, setZipCodes] = useState<string>('');
  // state to check if component is mounded
  const [mounted, setMounted] = useState(false);

  // specifically for trie(scene)
  const [foundAuthor, setFoundAuthor] = useState<string>('');
  useEffect(() => {
    console.log('[AlgorithmVisualizer] foundAuthor changed:', foundAuthor);
    console.log('[AlgorithmVisualizer] sceneName:', config.sceneName);

    if (config.sceneName !== 'Trie' || !foundAuthor) return;

    const fetchAndShowBooks = async () => {
      console.log('[AlgoVis] fetching books for:', foundAuthor);
      const books = await fetchAuthorBooks(foundAuthor);
      console.log('[AlgoVis] books fetched:', books);

      const bookList = books.length > 0
        ? books.map(b => `- ${b.title} (${b.first_publish_year || 'N/A'})`).join('\n')
        : 'No books found(OpenLibrary|Gemini)';

      goeyToast.info(`You've found a famous writer: ${foundAuthor}`, {
        description: `The most famous books/publications by this author: \n${bookList}`,
        borderColor: '#000000',
        borderWidth: 1.5,
        bounce: 0.75,
        timing: {
          displayDuration: 12000,
        },
      })
    };

    fetchAndShowBooks();
  }, [foundAuthor, config.sceneName]);
  
  // use a ref to store the state for unity events - prevents re-registering
  const stateRef = useRef(algorithmState);
  useEffect(() => {
    stateRef.current = algorithmState;
  }, [algorithmState]);

  useEffect(() => {
    setMounted(true);
    if (handler){
      setAlgorithmState(handler.initialState);
      setExplanation(handler.getExplanation(handler.initialState));
    }
  }, [handler]);

  const safeSanitize = useCallback((html: string)=> {
    if (!mounted || typeof window === 'undefined') return html;
    return DOMPurify.sanitize(html);
  }, [mounted]);

  //load the specific scene based on sceneName
  useEffect( () => {
    //only load scene if we're switching to a different scene
    if (currentScene === config.sceneName || !unityIsLoaded) return;

    let isSubscribed = true;

    const loadScene = async() => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!isSubscribed) return;
        
        console.log(`attempting to load scene: ${config.sceneName}`);
        sendMessage('SceneManager', 'LoadSceneByName', config.sceneName);
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (isSubscribed) {
          setCurrentScene(config.sceneName);
          setIsLoaded(true);
        }
      } catch (error) {
        console.log(`Failed to load ${config.sceneName} scene: `, error);
      }
    };

    loadScene();
    return () => {isSubscribed = false;};
  }, [unityIsLoaded, config.sceneName, sendMessage, currentScene]);

  // 
  const handleOperation = useCallback((operationName: string) => (...params: any[]) => {
    if (!handler) {
      console.warn(`No handler found for ${config.sceneName}`);
      return;
    }

    const result = handler.handleOperation(operationName, stateRef.current, ...params);
    
    setAlgorithmState(result.newState);
    setExplanation(handler.getExplanation(result.newState));
    
    if (config.sceneName === 'Trie' && operationName === 'OnAuthorFound') {
      console.log('[AlgorithmVisualizer] OnAuthorFound params:', params);
      console.log('[AlgorithmVisualizer] Result state message:', result.newState.message);
      setFoundAuthor(result.newState.message || '');
    }
    
    if (result.snippet) {
      setSnippet(result.snippet);
      setShowSnippet(true);
    }
    if (result.tooltip) {
      setSnippetTooltip(result.tooltip);
    }
  }, [handler, config.sceneName]);
  
  //register dispatch events from unity with handlers
  useEffect(() => {
    const handlers = config.operations.map((operation) => ({
      event: operation,
      handler: handleOperation(operation)
    }));

    handlers.forEach(({event, handler}) => {
      addEventListener(event, handler);
    })

    return () => {
      handlers.forEach(({event, handler}) => {
        removeEventListener(event, handler);
      });
    }
  }, [addEventListener, removeEventListener, config.operations, handleOperation]);

  const sendZipCodesToUnity = useCallback(() => {
    if (!unityIsLoaded || currentScene !== 'RadixSort') return;
    const zipArray = Zipcodes.split(',').map(s => s.trim()).filter(Boolean);
    
    // Validate that all elements are 5-digit numbers
    const isValid = zipArray.length > 0 && zipArray.every(zip => /^\d{5}$/.test(zip));
    
    if (!isValid) {
      goeyToast.error('Invalid Input', {
        description: 'Please enter comma-separated 5-digit numbers.',
        borderColor: '#ef4444',
        borderWidth: 1.5,
        bounce: 0.75,
        timing: {
          displayDuration: 5000,
        },
      });
      return;
    }
    
    console.log(JSON.stringify(zipArray));
    // RadixGameManager script is attached to GameManager object (we have to call the object)
    sendMessage("GameManager", "SetInputFromFrontend", JSON.stringify(zipArray));
  }, [Zipcodes, currentScene, unityIsLoaded, sendMessage]);

  return (
    
    <div className={`flex flex-col h-full ${className}`}>

      {!isLoaded && (
        <div className='flex items-center justify-center h-full text-white'>
          Loading {config.title}... {Math.round(loadingProgression * 100)}%
        </div>
      )}

      <div className="flex flex-row flex-1 gap-4 pointer-events-auto max-h-[90vh]">
        <GoeyToaster position="bottom-center" />

        {/* Unity container - 4:3 aspect ratio (Game) */}
        <div className="flex-1 flex items-center justify-center">
          <div className='relative w-full h-0 pb-[75%] max-h-[calc(100vh-100px)]'>
            <div className='absolute inset-0 rounded-2xl overflow-hidden shadow-lg'>
              <Unity 
                unityProvider={unityProvider} 
                className={`w-full h-full pointer-events-auto ${isLoaded ? 'block' : 'hidden'}`}
              />
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 flex flex-col gap-3 pointer-events-auto justify-center overflow-y-auto py-4">
          
          {/* Explanation Panel - PRIMARY FOCUS */}
          <div className="p-6 rounded-2xl bg-linear-to-br from-blue-900/40 to-purple-900/30 border-2 border-blue-400/60 shadow-lg shadow-blue-500/20 hover:border-blue-300 hover:shadow-blue-400/30 hover:rounded-none transition-all duration-200 overflow-auto min-h-75">
          <code className='text-blue-100 text-base font-medium'>{explanation}</code>
          {showSnippet && (
            <div className='overflow-x-visible'>
            <pre className="py-4 mt-3 border-t-2 border-blue-300/40" 
            data-tooltip-content={`${snippetTooltip}`} 
            data-tooltip-id='my-tooltip' data-tooltip-place='left' data-tooltip-delay-hide={400}>
              <code
                className="text-white my-3 text-sm font-mono"
                dangerouslySetInnerHTML={{ __html: safeSanitize(snippet) }}
              />
            </pre>
            <Tooltip id='my-tooltip' clickable className="custom-rt-tooltip fixed"
              classNameArrow="custom-rt-tooltip-arrow" />
            </div>
          )}
          </div>
          {/* Description Panel - SECONDARY */}
          <div className="p-3 rounded-2xl text-white/80 font-(family-name:--font-sf) bg-white/5 border border-white/20 hover:bg-white/10 hover:rounded-none transition-all duration-200">
            <h2 className='text-base font-semibold mb-1.5 text-white/90'>{config.title}</h2>
            <p className='text-xs leading-relaxed' dangerouslySetInnerHTML={{ __html: safeSanitize(config.description) }} />

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="mt-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs rounded-2xl px-3 py-1.5 transition-all duration-300 cursor-pointer border border-white/20 hover:rounded-none"
              >
              More Info
            </Button>
          </div>
          {/* radix input */}
          {config.sceneName === 'RadixSort' && (
            <div className='flex flex-col mt-2 gap-2 items-start '>
              <input 
                value={Zipcodes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZipCodes(e.target.value)}
                placeholder='Comma-separated 5-digit number'
                onKeyDown={(e) => {if (e.key === 'Enter') sendZipCodesToUnity();}}
                className='w-full rounded-2xl text-white focus:rounded-none border-white border transition-all duration-200 text-sm p-2'
              />
              <Button onClick={sendZipCodesToUnity}
              className='p-4 w-full items-center border rounded-2xl transition-all duration-200 hover:rounded-none bg-blue-500/60 text-white hover:bg-blue-200 hover:text-black'
              >
                <Send size={16} strokeWidth={0.8}/>
                Send to game</Button>
            </div>
          )}
        </div>
        
        {/* Modal Portal */}
        {isModalOpen && createPortal(
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn pointer-events-none"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-black/50 rounded-2xl p-6 max-h-[80vh] w-auto max-w-[70vw] overflow-y-auto animate-fadeIn border border-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 pointer-events-auto">
                <h2 className="text-2xl font-bold text-accent border rounded-2xl px-4">{config.title}</h2>
                <Button size={'sm'} className='rounded-4xl w-auto hover:cursor-pointer hover:text-destructive hover:shadow-destructive' variant={'outline'} onClick={() => setIsModalOpen(false)}>
                  <X size={16}/>
                </Button>
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

'use client';
import { useCallback, useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

interface QueueVisualizerProps {
  className?: string;
}

function QueueVisualizer({className = 'w-full h-full'}: QueueVisualizerProps) {

  const [score, setScore] = useState(0);
  const [explanation, setExplanation] = useState<string>("");
  const [snippet, setSnippet] = useState<string>("");
  const [showSnippet, setShowSnippet] = useState(false);
  const [isSnippetFadingOut, setIsSnippetFadingOut] = useState(false);

  const pseudoCodes = [
    {
      title: "Enqueue Operation",
      code: `function enqueue(queue, item) {
  queue.push(item);
  return queue;
}`,
    },
    {
      title: "Dequeue Operation",
      code: `function dequeue(queue) {
  if (queue.length === 0) {
    throw new Error("Queue is empty");
  }
  return queue.shift();
}`,
    },
  ]

  const getExplanation = (score: number): string => {
    if (score === 0) {
      return "The queue is empty. Dequeue operation cannot be performed, it would result in an error.";
    }
    if (score >= 1 && score <= 10) {
      return "Queue has items. Operations can be performed.";
    }
    return "Default explanation";
  };

  // init unity context
  const {unityProvider, isLoaded, loadingProgression, unload, addEventListener, removeEventListener} = useUnityContext({
    loaderUrl: '/Build/webDemo.loader.js',
    dataUrl: '/Build/webDemo.data',
    frameworkUrl: '/Build/webDemo.framework.js',
    codeUrl: '/Build/webDemo.wasm',
  });

  const handleEnqueue = useCallback((...parameters: any[]) => {
    const newScore = parameters[0] as number;
    setScore(prev => prev + 1);
    setExplanation(getExplanation(newScore));
    setSnippet(pseudoCodes[0].code);
    
    // Trigger fade in
    setShowSnippet(true);
    setIsSnippetFadingOut(false);
    
    // Auto fade out after 5 seconds
    setTimeout(() => {
      setIsSnippetFadingOut(true);
      // Hide completely after fade out animation
      setTimeout(() => {
        setShowSnippet(false);
        setIsSnippetFadingOut(false);
      }, 500); // 500ms = fade out duration
    }, 5000); // 5 seconds display time
  }, []);

  useEffect(() => {
    return () => {
      if (isLoaded) {
        unload();
      }
    }
  }, [isLoaded, unload]);

  useEffect(() => {
    addEventListener('Enqueue', handleEnqueue);
    return () => {
      removeEventListener('Enqueue', handleEnqueue);
    };
  }, [addEventListener, removeEventListener, handleEnqueue]);

  return (
    <>
      {!isLoaded && (
        <div className='flex items-center justify-center h-full'>Loading ... {Math.round(loadingProgression * 100)}%</div>
      )}
      <div className="flex flex-row min-w-3xl  m-6 space-x-2 p-3 rounded-2xl shadow-lg max-h-screen">
        <div className="basis-2/3 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
        <Unity unityProvider={unityProvider} className={`w-full h-full ${isLoaded ? 'block' : 'hidden'}`}/>
        </div>
        <div className="basis-1/3 rounded-2xl flex flex-col space-y-2">
          <div className="basis-1/3 p-2 rounded-2xl text-black border-2 border-x-black">
          <p>{explanation}</p>
          {showSnippet && (
            <p className={`text-black ${
              isSnippetFadingOut ? 'animate-fadeOut' : 'animate-fadeIn'
            }`}>{snippet}</p>
          )}
          </div>

          <div className="basis-2/3 overflow-y-auto p-0.5 rounded-2xl text-black font-[family-name:var(--font-sf)] border-2 border-x-black">
            <p>
            A <a href='https://en.wikipedia.org/wiki/Queue_(abstract_data_type)' className="underline hover:bg-black hover:text-white transition-all ease-in duration-300">QUEUE</a> is an organized group of objects where new items are added at one end, known as the rear, and old items are taken out at the other end, known as the front.
 It follows the <a href='https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)' className="underline hover:bg-black hover:text-white transition-all ease-in duration-300">First-In-First-Out (FIFO)</a> principle, meaning the first item added to the queue is the first one to be removed.
            </p> <br />
            <ul className="list-disc pl-5">
              <li>Enqueue: Add an item to the rear of the queue.</li>
              <li>Dequeue: Remove an item from the front of the queue.</li>
              <li>Peek: View the item at the front without removing it.</li>
              <li>IsEmpty: Check if the queue is empty.</li>
            </ul>
          
          </div>
        </div>
      </div>
      
    </>
  )
}

export default QueueVisualizer;

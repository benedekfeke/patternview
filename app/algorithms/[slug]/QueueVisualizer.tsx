'use client';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pseudoCodes = [
    {
      title: "Enqueue Operation",
      code: `function enqueue(queue, item) {<br />&nbsp;&nbsp;queue.push(item);<br />&nbsp;&nbsp;return queue;<br />}`,
    },
    {
      title: "Dequeue Operation",
      code: `function dequeue(queue) {<br />&nbsp;&nbsp;if (queue.length === 0) {<br />&nbsp;&nbsp;&nbsp;&nbsp;throw new Error("Queue is empty");<br />&nbsp;&nbsp;}<br />&nbsp;&nbsp;return queue.shift();<br />}`,
    },
  ];

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
      <div className="flex flex-row min-w-3xl  m-6 space-x-2 p-3 rounded-2xl shadow-lg max-h-screen relative">
        <div className="basis-2/3 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
        <Unity unityProvider={unityProvider} className={`w-full h-full ${isLoaded ? 'block' : 'hidden'}`}/>
        </div>
        <div className="basis-1/3 rounded-2xl flex flex-col space-y-2">
          <div className="basis-1/3 p-2 rounded-2xl text-black border-2 border-x-black">
          <p>{explanation}</p>
          {showSnippet && (
            <p
              className={`text-black ${
                isSnippetFadingOut ? 'animate-fadeOut' : 'animate-fadeIn'
              }`}
              dangerouslySetInnerHTML={{ __html: snippet }}
            />
          )}
          </div>

          <div className="basis-2/3 overflow-y-auto p-0.5 rounded-2xl text-black font-[family-name:var(--font-sf)] border-2 border-x-black bg-blue-500">
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

          
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="relative bottom-1 left-0  bg-red-900 rounded-2xl p-1 mt-4 hover:bg-amber-300 transition-all duration-300"
            >
              Press me
            </Button>
          </div>
        </div>

        {/* Modal Portal */}
        {isModalOpen && createPortal(
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-white rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">Modal Title</h2>
                <Button size={'sm'} variant={'outline'} onClick={() => setIsModalOpen(true)}/>
              </div>
              <div className="text-black">
                <p>Your modal content goes here...</p>
                <p className="mt-4">Click outside or the × button to close.</p>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
      
    </>
  )
}

export default QueueVisualizer;

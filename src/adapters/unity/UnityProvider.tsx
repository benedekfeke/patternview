'use client'

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useUnityContext } from "react-unity-webgl";

const unityConfig = {
  loaderUrl: "/Build/webDemo.loader.js",
  dataUrl: "/Build/webDemo.data",
  frameworkUrl: "/Build/webDemo.framework.js",
  codeUrl: "/Build/webDemo.wasm"
};

type UnityContextType = ReturnType<typeof useUnityContext>;

const UnityContextProvider = createContext<UnityContextType | null>(null);

export function UnityProvider({children}:{children: ReactNode}){

  const unityContext = useUnityContext(unityConfig);

  return (
    <UnityContextProvider.Provider value={unityContext}>
      {children}
    </UnityContextProvider.Provider>
  );
}

export function useSharedUnity() {
  const context = useContext(UnityContextProvider);
  useEffect(() => {
    const preventUnityHijack = (e: KeyboardEvent) => {
      // 1. Identify if the current focus is on a UI element
      const target = e.target as HTMLElement;
      const isInput = 
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA" || 
        target.isContentEditable ||
        target.closest('.mdx-editor'); // Specific to MDXEditor

      // 2. If typing in UI, kill the event before Unity sees it
      if (isInput) {
        // stopImmediatePropagation is the "Nuclear Option"
        // It stops other listeners on the SAME element (window) from firing.
        e.stopImmediatePropagation();
      }
    };

    // The 'true' argument is CRITICAL. It puts us in the Capture Phase.
    window.addEventListener("keydown", preventUnityHijack, true);
    window.addEventListener("keyup", preventUnityHijack, true);
    window.addEventListener("keypress", preventUnityHijack, true);

    return () => {
      window.removeEventListener("keydown", preventUnityHijack, true);
      window.removeEventListener("keyup", preventUnityHijack, true);
      window.removeEventListener("keypress", preventUnityHijack, true);
    };
    
  }, []);
  if (!context) {
    throw new Error("useSharedUnity must be used within UnityProvider");
  }
  return context;
}

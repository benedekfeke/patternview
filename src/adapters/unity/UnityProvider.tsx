'use client'

import { createContext, ReactNode, useContext } from "react";
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
  if (!context) {
    throw new Error("useSharedUnity must be used within UnityProvider");
  }
  return context;
}

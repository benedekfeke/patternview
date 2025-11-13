import { UnityProvider } from "./UnityProvider";

export default function AlgorithmsLayout({
  children,
} : {
  children: React.ReactNode;
}) {
  return (
    <UnityProvider>
      {children}
    </UnityProvider>
  );
}

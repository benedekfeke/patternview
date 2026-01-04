import { UnityProvider } from "@/src/adapters/unity/UnityProvider";

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

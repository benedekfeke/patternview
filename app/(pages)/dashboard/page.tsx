'use client'
import { pathfindingConfig } from "@/src/domain/algorithm/configs/pathfinding.config";
import { queueConfig } from "@/src/domain/algorithm/configs/queue.config";
import { useState } from "react";
import AlgorithmManager, { AlgorithmConfig } from "./components/AlgorithmManager";
import AnalyticsPanel from "./components/AnalyticsPanel";
import DashboardSidebar, { PanelType } from "./components/DashboardSidebar";
import UserManager from "./components/UserManager";

export default function Dashboard() {

  const [activePanel, setActivePanel] = useState<PanelType>(null);

  // store these in DB in the future
  const [algorithms, setAlgorithms] = useState<Record<string, AlgorithmConfig>>({
    queue: queueConfig as AlgorithmConfig,
    pathfinding: pathfindingConfig as AlgorithmConfig,
  });

  const handleSaveAlgorithm = (name: string, config: AlgorithmConfig) => {
    setAlgorithms(prev => ({
      ...prev, [name]: config,
    }));
    // TODO: USE database/api
    console.log(`Saving ${name}:`, config)
  };

  return (
    <div 
      className="flex min-h-screen pointer-events-auto bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/nice_blur_lines.jpg')" }}
    >
      {/* Left sidebar */}
      <DashboardSidebar activePanel={activePanel} onPanelChange={setActivePanel}/>

      {/* Right panel */}
      {activePanel && (
        <div className="flex-1 p-4 pl-0">
          <div className=" bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 overflow-hidden">
          {activePanel === 'algorithms' && (
            <AlgorithmManager algorithms={algorithms} onSave={handleSaveAlgorithm}/>
          )}
          {activePanel === 'users' && <UserManager/>}
          {activePanel === 'analytics' && <AnalyticsPanel/>}
          </div>
        </div>
      )}
    </div>
  )


}

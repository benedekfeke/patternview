import { Button } from "@/app/components/button";

export type PanelType = 'algorithms' | 'users' | 'analytics' | null;

interface DashboardSidebarProps {
  activePanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
}

export default function DashboardSidebar({activePanel, onPanelChange}: DashboardSidebarProps) {
  const menuItems: {id: PanelType; label: string}[] = [
    {id: 'algorithms', label: 'Manage Algorithms'},
    {id: 'users', label: 'Manage Users'},
    {id: 'analytics', label: 'Analytics'},
  ];

  return (
    <div className="flex flex-col w-64 space-y-4 p-4">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          onClick={() => onPanelChange(activePanel === item.id ? null : item.id)}
          className={`inline-flex w-full items-center justify-start rounded-lg backdrop-blur-md border border-white/20 px-4 py-3 text-lg font-normal transition-all hover:cursor-pointer
            ${activePanel === item.id ? 'bg-primary text-white border-white/40'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
            }
          `}
        >
          {item.label}
        </Button>
      ))}
    </div>
  )

};




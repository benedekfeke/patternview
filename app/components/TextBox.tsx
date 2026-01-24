import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";

interface TextBoxProps {
  label: string;
  content: string | number | undefined;
  editable: boolean;
  onSave?: (newValue: string) => Promise<void>;
  className?: string;
}

export default function TextBox({label, content, className = "", editable = false, onSave}: TextBoxProps)
{
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave(value);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save:', error);
        setValue(content?.toString() || '');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setValue(content?.toString() || '');
    setIsEditing(false);
  }

  return (
    <div className={`flex flex-col gap-2 p-3 bg-white/30 rounded-2xl overflow-hidden hover:rounded-none trasnition-all duration-200 [&_button]:hover:rounded-none border-2 border-black ${className} pointer-events-auto w-full`}>
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800 text-sm">
          {label}
        </span>
        
        {/* Action buttons */}
        {isEditing ? (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1.5 bg-green-500/20 text-green-400 rounded-md border border-green-500/30 hover:bg-green-500/40 transition-all duration-150 disabled:opacity-50 hover:cursor-pointer"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check size={14} />
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-1.5 bg-red-500/20 text-red-400 rounded-md border border-red-500/30 hover:bg-red-500/40 transition-all duration-150 disabled:opacity-50 hover:cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          editable && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30 hover:bg-purple-500/40 transition-all duration-150 hover:cursor-pointer shrink-0 "
            >
              <Pencil size={14} />
            </button>
          )
        )}
      </div>

      {/* Content area */}
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
          disabled={isSaving}
          autoFocus
        />
      ) : (
        <span className="text-white break-words">
          {content || <span className="text-gray-500 italic">Not set</span>}
        </span>
      )}
    </div>
  );
}

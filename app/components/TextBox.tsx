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
    <div className={`flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 ${className} pointer-events-auto`}>
      <span className="font-semibold text-gray-700 min-w-[100px]">
        {label}:
      </span>

      {isEditing ? (
        <>
          <input
            type="text"
            value={content}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSaving}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 bg-blue-300 text-black rounded-4xl border-black hover:bg-blue-700 hover:text-white transition-all duration-100 disabled:opacity-50 hover:cursor-pointer"
            >
              {isSaving ? '...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3 py-1 bg-red-300 text-black rounded-4xl hover:bg-red-600 hover:text-white hover:shadow-2xl transition-all duration-100 disabled:opacity-50 hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="text-gray-900 flex-1">
            {content}  
          </span>
          {editable && (
            <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-yellow-200 rounded-4xl backdrop-blur-2xl text-black hover:bg-yellow-400 transition-all duration-150 hover:cursor-pointer"
              >
                Edit
            </button>
          )}
        </>
      )}
    </div>
  );
}


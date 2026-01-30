'use client'

import { useSharedUnity } from "@/src/adapters/unity/UnityProvider";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";
import { ForwardRefEditor } from "./ForwardRefEditor";


interface NotepadPage {
  id: number;
  pageNumber: number;
  title: string;
  content: string;
}

interface NotepadModalProps {
  isOpen: boolean; // passed from Header
  onClose: () => void; // callback to close modal - from Header
}

export default function NotepadModal({isOpen, onClose}: NotepadModalProps) {
  // all pages
  const [pages, setPages] = useState<NotepadPage[]>([]);

  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);

  // editable fields
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // ui states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {UNSAFE__unityInstance, sendMessage} = useSharedUnity();

  useEffect(() => {

    if (isOpen) {
      sendMessage("SceneManager", "SetFocus", 0);
    } else {
      sendMessage("SceneManager", "SetFocus", 1);
    }

  }, [isOpen, sendMessage, UNSAFE__unityInstance]);

  // fetch all pages when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchPages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/notepad/pages');
        // notepad does not exist
        if (response.status === 404) {
          setPages([]);
          setCurrentPageNumber(1);
          setTitle('');
          setContent('');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch pages');
        }

        const data = await response.json();
        const fetchedPages: NotepadPage[] = data.pages || [];

        setPages(fetchedPages);

        //load first page
        if (fetchedPages.length > 0) {
          const firstPage = fetchedPages[0];
          setCurrentPageNumber(firstPage.pageNumber);
          setTitle(firstPage.title);
          setContent(firstPage.content);
        } else {
          setCurrentPageNumber(1);
          setTitle("");
          setContent("");
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
        setError('Failed to load notepad');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages();
  }, [isOpen]);

  // keep track of unsaved changes
  useEffect(() => {
    const currentPage = pages.find(p => p.pageNumber === currentPageNumber);

    if (currentPage) {
      const hasChanges = title !== currentPage.title || content !== currentPage.content;
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(title.length > 0 || content.length > 0);
    }

  }, [title, content, pages, currentPageNumber]);

  // select another page
  const handlePageSelect = useCallback((pageNumber: number) => {
    if (hasUnsavedChanges) {
      const confirmSwitch = window.confirm(`Switch to page ${pageNumber}? All unsaved changes will be lost`);
      if (!confirmSwitch) {
        return;
      }
    }

    const page = pages.find(p => p.pageNumber === pageNumber);

    setCurrentPageNumber(pageNumber);
    setTitle(page?.title ?? '');
    setContent(page?.content ?? '');
    setHasUnsavedChanges(false);
  }, [pages, hasUnsavedChanges]);


  // add page
  const handleAddPage = useCallback(() => {
    if (pages.length >= 50) {
      setError('Maximum 50 pages allowed');
      return;
    }

    // find next page number (first unused page number)
    const usedNumbers = new Set(pages.map(p => p.pageNumber));
    let nextNumber = 1;
    while(usedNumbers.has(nextNumber) && nextNumber <= 50) {
      nextNumber++;
    }

    if (hasUnsavedChanges) {
      const confirmSwitch = window.confirm('Create new page? All unsaved changes will be lost');
      if (!confirmSwitch) return;
    }

    setCurrentPageNumber(nextNumber);
    setTitle('');
    setContent('');
    setHasUnsavedChanges(false); 
  }, [pages, hasUnsavedChanges]);

  // save current page
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/notepad/pages/${currentPageNumber}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: title || 'Untitled', content}),
      });
      console.log(content);
      
      if (!response.ok) {
        throw new Error('Failed ot save page');
      }

      const data = await response.json();
      const savedPage: NotepadPage = data.page;

      setPages(prev => {
        const exists = prev.some(p => p.pageNumber === savedPage.pageNumber);
        if (exists) {
          return prev.map(p => p.pageNumber === savedPage.pageNumber ? savedPage : p);
        } else {
          return [...prev, savedPage].sort((a,b) => a.pageNumber - b.pageNumber);
        }
      });

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save page: ', error);
      setError('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  }

  // handle delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Delete this page?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/notepad/pages/${currentPageNumber}`, {
        method: 'DELETE',
      });

      if (!response.ok && response.status !== 404) {
        throw new Error('Failed to delete page');
      }

      // remove from local
      const newPages = pages.filter(p => p.pageNumber !== currentPageNumber);
      setPages(newPages);

      // switch to first available page or create new
      if (newPages.length > 0) {
        handlePageSelect(newPages[0].pageNumber);
      } else {
        setCurrentPageNumber(1);
        setTitle('');
        setContent('');
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to delete page:', error);
      setError('Failed to delete page');
    }
  }

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('Close page? All unsaved changes will be lost');
      if (!confirmed) return;
    }
    onClose();
  }

  if (!isOpen) return null;

  // portal ro render the notepad
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center">
      {/* backdrop */}
      <div onClick={handleClose} className="absolute inset-0 bg-black/20 backdrop-blur-sm"/>
        {/* modal container */}
        <div className="relative w-full max-w-4xl h-[80vh] mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden flex flex-col">
          {/* header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">
              Notepad {hasUnsavedChanges && <span className="text-yellow-400 ml text-sm">⬤ You have unsaved changes</span>}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors">
              <X size={20}/>
            </button>
          </div>

        {/* display error */}
        {error && (
          <div className="px-4 py-2 bg-red-20 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-white">
            <Loader2 className="animate-spin mr-2"/>
            Loading...
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* page list (left) */}
            <div className="w-48 border-r border-white/20 flex flex-col">
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {pages.map(page => (
                  <button key={page.pageNumber} onClick={() => handlePageSelect(page.pageNumber)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors 
                    ${page.pageNumber === currentPageNumber ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                  >{page.title || `Page ${page.pageNumber}`}
                  </button>
                ))}

                {/* show unsaved changes on page */}
                {!pages.some(p => p.pageNumber===currentPageNumber) && (
                  <div className="px-3 py-2 rounded-lg text-sm bg-white/20 text-white">
                    {title || `Page ${currentPageNumber}`}
                    <span className="text-yellow-400 ml-1">*</span>
                  </div>
                )}
              </div>
              {/* new page button */}
              <div className="p-2 border-t border-white/20">
                <Button
                  onClick={handleAddPage}
                  disabled={pages.length >= 50}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white"
                ><Plus size={16}/>Add Page</Button>
              </div>
            </div>
            {/* content(right) */}
            <div className="flex-1 flex flex-col p-4">
              {/* title input */}
              <input autoFocus contentEditable="true"
                type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title..."
                className="w-full px-3 py-2 mb-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />



              {/* content area */}
              {/* <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Page content..."
                className="flex-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30"
              /> */}
              <article className="overflow-y-auto rounded-lg">
              <ForwardRefEditor key={currentPageNumber} markdown={content} className="text-white" onChange={(e) => setContent(e)}/>

              </article>

              {/* buttons */}
              <div className="flex justify-between items-center mt-4">
                {/* delete */}
                <Button onClick={handleDelete} disabled={!pages.some(p => p.pageNumber === currentPageNumber)} className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300"
                ><Trash2 size={16}/>Delete Page</Button>
                {/* save */}
                <Button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges}
                className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
                >{isSaving? (
                  <Loader2 size={16} className="animate-spin"/>
                ) : (
                  <Save size={16}/>
                )}
                {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>          
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body //portal render doc root
  );
}

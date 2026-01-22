'use client'
// InitializedMDXEditor.tsx
import {
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  CreateLink,
  headingsPlugin,
  InsertCodeBlock,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  type MDXEditorMethods,
  type MDXEditorProps
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import type { ForwardedRef } from 'react';
import './css/mdxeditor.module.css';

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      className='mdxeditor-popup-container'
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: "css",
            txt: "txt",
            sql: "sql",
            html: "html",
            sass: "sass",
            scss: "scss",
            bash: "bash",
            json: "json",
            js: "javascript",
            ts: "typescript",
            "": "unspecified",
            tsx: "TypeScript (React)",
            jsx: "JavaScript (React)",
          },
          autoLoadLanguageSupport: true,
        }),
        toolbarPlugin({
          toolbarClassName: '!rounded-lg !gap-2',
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CodeToggle/>
              <InsertCodeBlock/>
              <CreateLink/>
            </>
          )
        })
      ]}
      contentEditableClassName='mt-4 min-h-[200px] active:outline-purple-400 text-white p-4 rounded-lg bg-white/80 [&_a]:underline [&_a]:cursor-pointer [&_a]:text-blue-800 [&_a]:visited:text-purple-700'
      {...props}
      ref={editorRef}
    />
  )
}

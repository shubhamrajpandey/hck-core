"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import type { Level } from "@tiptap/extension-heading";

import { Button } from "@/components/ui/button";

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List as ListIcon,
  ListOrdered as OrderedListIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Underline as UnderlineIcon,
  Image as ImageIcon, // <-- Import Image icon from lucide-react
} from "lucide-react";

import React, { useRef } from "react";
import { Separator } from "@radix-ui/react-separator";
import { Toggle } from "@radix-ui/react-toggle";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const headingLevels = [1, 2, 3, 4, 5, 6];

const alignmentOptions = [
  { name: "left", icon: AlignLeft },
  { name: "center", icon: AlignCenter },
  { name: "right", icon: AlignRight },
  { name: "justify", icon: AlignJustify },
];

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit, 
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Bold,
      Italic,
      Underline,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!editor) return null;

  function setHeading(level: number) {
    if (!editor) return;

    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: level as Level })
        .run();
    }
  }

  function insertImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string" && editor) {
        editor
          .chain()
          .focus()
          .setImage({
            src: reader.result,
            alt: file.name,
          })
          .run();
      }
    };
    reader.readAsDataURL(file);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      insertImage(files[0]);
      e.target.value = ""; 
    }
  }

  return (
    <div className="border border-gray-300 rounded-md mt-4 p-4 bg-white">
      <div className="flex items-center gap-1 mb-3 flex-wrap border-b border-gray-300 pb-2">
        {/* Heading dropdown */}
        <select
          className="px-2 py-1 text-sm"
          onChange={(e) => setHeading(Number(e.target.value))}
          value={
            headingLevels.find((level) =>
              editor.isActive("heading", { level })
            ) || 0
          }
          aria-label="Select heading level"
        >
          <option value={0}>Text</option>
          {headingLevels.map((level) => (
            <option key={level} value={level}>
              H{level}
            </option>
          ))}
        </select>

        <Separator orientation="vertical" className="mx-2 h-6" />

        {/* Bold */}
        <Toggle
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <BoldIcon className="w-4 h-4" />
        </Toggle>

        {/* Italic */}
        <Toggle
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <ItalicIcon className="w-4 h-4" />
        </Toggle>

        {/* Underline */}
        <Toggle
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-2 h-6" />

        {/* Bullet List */}
        <Toggle
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          aria-label="Bullet List"
        >
          <ListIcon className="w-4 h-4" />
        </Toggle>

        {/* Ordered List */}
        <Toggle
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          aria-label="Ordered List"
        >
          <OrderedListIcon className="w-4 h-4" />
        </Toggle>

        <Separator orientation="vertical" className="mx-2 h-6" />

        {/* Text Align */}
        {alignmentOptions.map(({ name, icon: Icon }) => (
          <Toggle
            key={name}
            pressed={editor.isActive({ textAlign: name })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign(name).run()
            }
            aria-label={`Align ${name}`}
          >
            <Icon className="w-4 h-4" />
          </Toggle>
        ))}

        <Separator orientation="vertical" className="mx-2 h-6" />

        {/* Insert Link */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const url = prompt("Enter link URL");
            if (url && editor)
              editor.chain().focus().setLink({ href: url }).run();
          }}
          aria-label="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </div>

      <Separator className="mb-3" />

      <EditorContent
        editor={editor}
        className="prose max-w-none min-h-[200px] focus:outline-none"
      />


      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
    </div>
  );
}

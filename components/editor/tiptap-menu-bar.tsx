"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Type } from "lucide-react";
import logger from "@/utils/logger";
import type { Editor } from "@tiptap/react";
import Cookies from "js-cookie";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  CodeSquare,
  Eye,
  EyeOff,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Moon,
  Palette,
  Quote,
  Redo,
  Strikethrough,
  Sun,
  Underline,
  Undo,
} from "lucide-react";
import { useEffect, useState } from "react";

interface TiptapMenuBarProps {
  editor: Editor | null;
  codeView?: boolean;
  setCodeView?: (v: boolean) => void;
}
const API_URL = process.env.NEXT_PUBLIC_EVENT_API_URL;

export const TiptapMenuBar = ({
  editor,
  codeView = true,
  setCodeView,
}: TiptapMenuBarProps) => {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // image dialog state
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | string | null>(null);
  const [uploadOption, setUploadOption] = useState<"system" | "url">("system");
  const [isUploading, setIsUploading] = useState(false);

  // Theme management
  useEffect(() => {
    setMounted(true);
    // Get initial theme
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      const isDark =
        root.classList.contains("dark") ||
        root.getAttribute("data-theme") === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.classList.toggle("dark", newTheme === "dark");
      root.setAttribute("data-theme", newTheme);
      Cookies.set("theme", newTheme, { expires: 365 });
      localStorage.setItem("theme", newTheme);
    }
  };

  const handleInsertImage = async () => {
    if (!editor || !imageFile) return;

    try {
      setIsUploading(true);
      if (uploadOption === "url") {
        editor
          .chain()
          .focus()
          .setImage({ src: imageFile as string })
          .run();
        setImageDialogOpen(false);
        setImageFile(null);
      } else {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("folder", "editor-images");

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!result.success || !result.url) {
          throw new Error(result.error || "No url returned from API");
        }

        editor.chain().focus().setImage({ src: result.url }).run();
        setImageDialogOpen(false);
        setImageFile(null);
      }
    } catch (error) {
      logger.error(error);
      // you can show a toast here if you use one
    } finally {
      setIsUploading(false);
    }
  };

  if (!editor || !mounted) {
    return null;
  }

  return (
    <>
      <div className="border border-gray-200 rounded-t-lg p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-900">
        {/* Code View Toggle */}
        {setCodeView && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setCodeView(!codeView);
            }}
          >
            {codeView ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            toggleTheme();
          }}
          title={
            theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
          }
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        {/* Font Family Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              title="Font Family"
              className="min-w-[120px] justify-start"
            >
              <Type className="h-4 w-4 mr-2" />
              <span className="text-xs">
                {editor.getAttributes("textStyle").fontFamily || "Default"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                if (editor.can().unsetFontFamily()) {
                  editor.chain().focus().unsetFontFamily().run();
                }
              }}
            >
              Default
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (editor.can().setFontFamily("Arial, sans-serif")) {
                  editor.chain().focus().setFontFamily("Arial, sans-serif").run();
                }
              }}
            >
              <span style={{ fontFamily: "Arial, sans-serif" }}>Arial</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (editor.can().setFontFamily("Georgia, serif")) {
                  editor.chain().focus().setFontFamily("Georgia, serif").run();
                }
              }}
            >
              <span style={{ fontFamily: "Georgia, serif" }}>Georgia</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (editor.can().setFontFamily('"Times New Roman", serif')) {
                  editor.chain().focus().setFontFamily('"Times New Roman", serif').run();
                }
              }}
            >
              <span style={{ fontFamily: '"Times New Roman", serif' }}>Times New Roman</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (editor.can().setFontFamily('"Courier New", monospace')) {
                  editor.chain().focus().setFontFamily('"Courier New", monospace').run();
                }
              }}
            >
              <span style={{ fontFamily: '"Courier New", monospace' }}>Courier New</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (editor.can().setFontFamily("Verdana, sans-serif")) {
                  editor.chain().focus().setFontFamily("Verdana, sans-serif").run();
                }
              }}
            >
              <span style={{ fontFamily: "Verdana, sans-serif" }}>Verdana</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (editor.can().setFontFamily("Helvetica, sans-serif")) {
                  editor.chain().focus().setFontFamily("Helvetica, sans-serif").run();
                }
              }}
            >
              <span style={{ fontFamily: "Helvetica, sans-serif" }}>Helvetica</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (editor.can().setFontFamily("Comic Sans MS, cursive")) {
                  editor.chain().focus().setFontFamily("Comic Sans MS, cursive").run();
                }
              }}
            >
              <span style={{ fontFamily: "Comic Sans MS, cursive" }}>Comic Sans MS</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Undo/Redo Buttons */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        {/* Text Color */}
        <Popover open={showTextColor} onOpenChange={setShowTextColor}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={
                editor.isActive("textStyle")
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "relative"
              }
              title="Text Color"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 flex items-center">
            <input
              type="color"
              value={editor.getAttributes("textStyle").color || "#000000"}
              onChange={(e) => {
                e.preventDefault();

                editor.chain().focus().setColor(e.target.value).run();
                setShowTextColor(false);
              }}
              className="w-8 h-8 border-0 bg-transparent cursor-pointer"
              style={{ padding: 0 }}
            />
          </PopoverContent>
        </Popover>

        {/* Background Color */}
        <Popover open={showBgColor} onOpenChange={setShowBgColor}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={
                editor.isActive("highlight")
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }
              title="Background Color"
            >
              <Palette className="h-4 w-4" style={{ fill: "#ffe066" }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 flex items-center">
            <input
              type="color"
              value={editor.getAttributes("highlight").color || "#ffe066"}
              onChange={(e) => {
                e.preventDefault();

                editor
                  .chain()
                  .focus()
                  .setHighlight({ color: e.target.value })
                  .run();
                setShowBgColor(false);
              }}
              className="w-8 h-8 border-0 bg-transparent cursor-pointer"
              style={{ padding: 0 }}
            />
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={
            editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={
            editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={
            editor.isActive("strike") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHighlight().run();
          }}
          className={
            editor.isActive("highlight") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("left").run();
          }}
          className={
            editor.isActive({ textAlign: "left" })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("center").run();
          }}
          className={
            editor.isActive({ textAlign: "center" })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setTextAlign("right").run();
          }}
          className={
            editor.isActive({ textAlign: "right" })
              ? "bg-gray-200 dark:bg-gray-700"
              : ""
          }
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={
            editor.isActive("underline") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={
            editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={
            editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={
            editor.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          }}
          className={
            editor.isActive("codeBlock") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <CodeSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCode().run();
          }}
          className={
            editor.isActive("code") ? "bg-gray-200 dark:bg-gray-700" : ""
          }
        >
          <Code className="h-4 w-4" />
        </Button>
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={
              editor.isActive("image") ? "bg-gray-200 dark:bg-gray-700" : ""
            }
          >
            <DialogTrigger asChild>
              <button
                onClick={(event) => {
                  event.preventDefault();
                  setImageDialogOpen(true);
                }}
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            </DialogTrigger>
          </Button>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert image</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={uploadOption === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUploadOption("system")}
                >
                  Upload Via System
                </Button>
                <Button
                  type="button"
                  variant={uploadOption === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUploadOption("url")}
                >
                  Upload via URL
                </Button>
              </div>

              <div className="space-y-2">
                {uploadOption === "url" ? (
                  <input
                    type="text"
                    placeholder="Enter image URL"
                    onChange={(e) => {
                      const url = e.target.value;
                      setImageFile(url);
                    }}
                    className="block w-full text-sm border border-gray-300 rounded-md p-2"
                  />
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Choose an image file to insert into the editor.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setImageFile(file);
                      }}
                      className="block w-full text-sm border p-3 rounded-md border-gray-300 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>

            <DialogFooter className="mt-4 flex gap-2 justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isUploading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Insert image"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

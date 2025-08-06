"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { Post } from "@/lib/api"

interface PostFormProps {
  initialData?: Post | null;
  onSubmit: (data: Omit<Post, 'id' | 'userId'> | Post) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function PostForm({ initialData, onSubmit, onCancel, isSubmitting }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [body, setBody] = useState(initialData?.body || "");

  useEffect(() => {
    setTitle(initialData?.title || "");
    setBody(initialData?.body || "");
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      alert("Title and body cannot be empty.");
      return;
    }
    if (initialData) {
      onSubmit({ ...initialData, title, body }); // For update, include ID
    } else {
      onSubmit({ title, body }); // For create
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="body" className="text-right pt-2">
          Body
        </Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="col-span-3 min-h-[100px]"
          required
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Post"}
        </Button>
      </DialogFooter>
    </form>
  );
}

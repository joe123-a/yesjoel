"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Post } from "@/lib/api"
import { PencilIcon, Trash2Icon } from 'lucide-react'

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export function PostCard({ post, onEdit, onDelete, isDeleting }: PostCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">User ID: {post.userId}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-4">{post.body}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(post.id)} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : <Trash2Icon className="w-4 h-4 mr-2" />}
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

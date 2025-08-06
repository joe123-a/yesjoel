"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PostCard } from "@/components/post-card"
import { PostForm } from "@/components/post-form"
import { getPosts, createPost, updatePost, deletePost, Post } from "@/lib/api"
import { Loader2, PlusIcon } from 'lucide-react'

const POSTS_PER_PAGE = 10;

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError("Failed to load posts. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const totalPages = useMemo(() => Math.ceil(posts.length / POSTS_PER_PAGE), [posts.length]);
  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * POSTS_PER_PAGE;
    const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
    return posts.slice(indexOfFirstPost, indexOfLastPost);
  }, [posts, currentPage]);

  const handleCreateOrUpdatePost = async (formData: Omit<Post, 'id' | 'userId'> | Post) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingPost) {
        // Update existing post
        const updatedPost = await updatePost(editingPost.id, formData as Post);
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
      } else {
        // Create new post
        const newPost = await createPost(formData as Omit<Post, 'id' | 'userId'>);
        // JSONPlaceholder returns a dummy ID (101 for first new post)
        // We'll prepend it to the list for visibility
        setPosts((prevPosts) => [{ ...newPost, id: prevPosts.length > 0 ? Math.max(...prevPosts.map(p => p.id)) + 1 : 101 }, ...prevPosts]);
      }
      setIsFormOpen(false);
      setEditingPost(null);
    } catch (err) {
      setError(`Failed to ${editingPost ? 'update' : 'create'} post. Please try again.`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }
    setDeletingPostId(id);
    setError(null);
    try {
      await deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      // Adjust current page if the last post on a page was deleted
      if (currentPosts.length === 1 && currentPage > 1) {
        setCurrentPage(prev => Math.max(1, prev - 1));
      }
    } catch (err) {
      setError("Failed to delete post. Please try again.");
      console.error(err);
    } finally {
      setDeletingPostId(null);
    }
  };

  const openCreateForm = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const openEditForm = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">JSONPlaceholder Posts</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex justify-end mb-6">
        <Button onClick={openCreateForm}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create New Post
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading posts...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={openEditForm}
                onDelete={handleDeletePost}
                isDeleting={deletingPostId === post.id}
              />
            ))}
          </div>

          {posts.length > POSTS_PER_PAGE && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
          </DialogHeader>
          <PostForm
            initialData={editingPost}
            onSubmit={handleCreateOrUpdatePost}
            onCancel={closeForm}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}

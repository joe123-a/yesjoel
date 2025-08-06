// lib/api.ts

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}

export async function createPost(newPost: Omit<Post, 'id' | 'userId'>): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...newPost,
      userId: 1, // JSONPlaceholder assigns userId 1 for new posts
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  // JSONPlaceholder returns the new post with an ID
  return response.json();
}

export async function updatePost(id: number, updatedPost: Partial<Post>): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPost),
  });
  if (!response.ok) {
    throw new Error('Failed to update post');
  }
  // JSONPlaceholder returns the updated post
  return response.json();
}

export async function deletePost(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
  // JSONPlaceholder returns an empty object for successful delete
}

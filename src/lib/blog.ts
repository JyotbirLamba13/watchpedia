import { supabase } from './supabase';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
  meta_title?: string | null;
  meta_description?: string | null;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error.message);
    return [];
  }
  return data || [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) return null;
  return data;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true);

  if (error) return [];
  return (data || []).map(p => p.slug);
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  cover_image: string | null;
  bio: string | null;
  facebook: string | null;
  location: string | null;
  meta_description: string | null;
  meta_title: string | null;
  twitter: string | null;
  url: string;
  website: string | null;
}

export interface Post {
  access: boolean;
  authors: Author[];
  canonical_url: string | null;
  codeinjection_foot: string | null;
  codeinjection_head: string | null;
  comment_id: string;
  comments: boolean;
  created_at: string;
  custom_excerpt: string | null;
  custom_template: string | null;
  email_subject: string | null;
  excerpt: string;
  feature_image: string | null;
  feature_image_alt: string | null;
  feature_image_caption: string | null;
  featured: boolean;
  frontmatter: string | null;
  html: string;
  id: string;
  meta_description: string | null;
  meta_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_title: string | null;
  primary_author: Author;
  published_at: string;
  reading_time: number;
  slug: string;
  title: string;
  twitter_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  updated_at: string;
  url: string;
  uuid: string;
  visibility: string;
}

export interface Tag {
  accent_color: string | null;
  canonical_url: string | null;
  codeinjection_foot: string | null;
  codeinjection_head: string | null;
  description: string | null;
  feature_image: string | null;
  id: string;
  meta_description: string | null;
  meta_title: string | null;
  name: string;
  og_description: string | null;
  og_image: string | null;
  og_title: string | null;
  slug: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  url: string;
  visibility: string;
}

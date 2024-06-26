export type BasicBlogInfo = {
  title: string;
  description: string;
  signupEnabled: boolean;
  pages: { title: string; slug: string }[];
};

import DOMPurify from 'dompurify';

interface PostContentProps {
  html: string;
}

export default function PostContent({ html }: PostContentProps) {
  const cleanHtml = DOMPurify.sanitize(html);
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

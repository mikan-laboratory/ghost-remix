import DOMPurify from 'dompurify';

interface PostContentProps {
  html: string;
}

export default function PostContent({ html }: PostContentProps) {
  //   const cleanHtml = DOMPurify.sanitize(html); there is an issue with DOMpurify and reloading the page
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      />
    </div>
  );
}

interface PostContentProps {
  html: string;
}

export default function PostContent({ html }: PostContentProps) {
  return (
    <div className="post-content-wrapper">
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      />
      <style>{`
        .post-content iframe {
          display: block;
          max-width: 100%;
          width: 100%;
          aspect-ratio: 16/9;
          height: auto;
          border: none;
        }
        .post-content {
          overflow-x: hidden;
        }
        @media (max-width: 600px) {
          .post-content iframe {
            min-width: 0;
            max-width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}

interface PostContentProps {
  html: string;
}

export default function PostContent({ html }: PostContentProps) {
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      />
    </div>
  );
}

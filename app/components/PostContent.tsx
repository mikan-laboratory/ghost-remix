interface PostContentProps {
  html: string;
}

export default function PostContent({ html }: PostContentProps) {
  console.log(html);
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      />
    </div>
  );
}

import Markdown from "react-markdown";

export function MarkdownBody({ children }: { children: string }) {
  return (
    <article className="md-body">
      <Markdown>{children}</Markdown>
    </article>
  );
}

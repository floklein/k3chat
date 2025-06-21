import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export function Markdown({ children }: { children: string }) {
  const { resolvedTheme } = useTheme();

  return (
    <ReactMarkdown
      components={{
        h1(props) {
          const { children, ...rest } = props;
          return (
            <h1 {...rest} className="text-3xl font-bold mt-12 mb-6">
              {children}
            </h1>
          );
        },
        h2(props) {
          const { children, ...rest } = props;
          return (
            <h2 {...rest} className="text-2xl font-bold mt-12 mb-6">
              {children}
            </h2>
          );
        },
        h3(props) {
          const { children, ...rest } = props;
          return (
            <h3 {...rest} className="text-xl font-bold mt-8 mb-3">
              {children}
            </h3>
          );
        },
        h4(props) {
          const { children, ...rest } = props;
          return (
            <h4 {...rest} className="text-lg font-bold mt-6 mb-2">
              {children}
            </h4>
          );
        },
        h5(props) {
          const { children, ...rest } = props;
          return (
            <h5 {...rest} className="text-base font-bold mt-4 mb-1">
              {children}
            </h5>
          );
        },
        h6(props) {
          const { children, ...rest } = props;
          return (
            <h6 {...rest} className="text-sm font-bold">
              {children}
            </h6>
          );
        },
        p(props) {
          const { children, ...rest } = props;
          return (
            <p {...rest} className="my-5">
              {children}
            </p>
          );
        },
        ul(props) {
          const { children, ...rest } = props;
          return (
            <ul {...rest} className="list-disc list-inside my-5 pl-6.5">
              {children}
            </ul>
          );
        },
        ol(props) {
          const { children, ...rest } = props;
          return (
            <ol {...rest} className="list-decimal list-inside my-5 pl-6.5">
              {children}
            </ol>
          );
        },
        li(props) {
          const { children, ...rest } = props;
          return (
            <li {...rest} className="my-2 pl-1.5">
              {children}
            </li>
          );
        },
        hr(props) {
          const { children, ...rest } = props;
          return <hr {...rest} className="my-12" />;
        },
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              PreTag="div"
              language={match[1]}
              style={resolvedTheme === "dark" ? vscDarkPlus : vs}
              customStyle={{
                borderRadius: "var(--radius)",
                backgroundColor: "var(--accent)",
                border: "none",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

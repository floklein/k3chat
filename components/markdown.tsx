import { cn } from "@/lib/utils";
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
        h1({ children, ...rest }) {
          return (
            <h1 {...rest} className="text-3xl font-bold mt-12 mb-6">
              {children}
            </h1>
          );
        },
        h2({ children, ...rest }) {
          return (
            <h2 {...rest} className="text-2xl font-bold mt-12 mb-6">
              {children}
            </h2>
          );
        },
        h3({ children, ...rest }) {
          return (
            <h3 {...rest} className="text-xl font-bold mt-8 mb-3">
              {children}
            </h3>
          );
        },
        h4({ children, ...rest }) {
          return (
            <h4 {...rest} className="text-lg font-bold mt-6 mb-2">
              {children}
            </h4>
          );
        },
        h5({ children, ...rest }) {
          return (
            <h5 {...rest} className="text-base font-bold mt-4 mb-1">
              {children}
            </h5>
          );
        },
        h6({ children, ...rest }) {
          return (
            <h6 {...rest} className="text-sm font-bold">
              {children}
            </h6>
          );
        },
        p({ children, ...rest }) {
          return (
            <p {...rest} className="my-5">
              {children}
            </p>
          );
        },
        ul({ children, ...rest }) {
          return (
            <ul {...rest} className="list-disc list-inside my-5 pl-6.5">
              {children}
            </ul>
          );
        },
        ol({ children, ...rest }) {
          return (
            <ol {...rest} className="list-decimal list-inside my-5 pl-6.5">
              {children}
            </ol>
          );
        },
        li({ children, ...rest }) {
          return (
            <li {...rest} className="my-2 pl-1.5">
              {children}
            </li>
          );
        },
        hr({ children, ...rest }) {
          return <hr {...rest} className="my-12" />;
        },
        code({ children, className, node, ...rest }) {
          const match = /language-(\w+)/.exec(className ?? "");
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
            <code
              {...rest}
              className={cn(
                className,
                "bg-accent px-[0.25em] py-[0.125em] rounded-sm",
              )}
            >
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

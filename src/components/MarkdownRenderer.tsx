import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';

// Register languages
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yaml', yaml);

interface MarkdownRendererProps {
    content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <div className="code-block">
                            <div className="code-header">
                                <span className="font-mono text-xs">{match[1]}</span>
                            </div>
                            <SyntaxHighlighter
                                style={oneDark as any}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
                blockquote: ({ children }) => {
                    // Check if children contain admonition markers
                    // This is a simplified check, depending on how Hugo 'shortcodes' were converted to md
                    // Assuming content migration converted shortcodes to blockquotes with specific prefixes or we handle standard MD blockquotes

                    // Since we are migrating text, we might encounter `> **Note**` style blockquotes
                    // We can try to detect them here or rely on the migration script to format them as HTML/JSX
                    // For now, standard blockquote styling
                    return (
                        <blockquote className="border-l-4 border-aws-orange pl-4 py-2 my-4 italic bg-orange-50/50 text-slate-600 rounded-r-lg">
                            {children}
                        </blockquote>
                    );
                },
                // Custom component for tables
                table: ({ children }) => (
                    <div className="overflow-x-auto">
                        <table className="content-table">{children}</table>
                    </div>
                ),
                img: ({ src, alt }) => (
                    <img
                        src={src}
                        alt={alt}
                        className="content-image w-full object-cover max-h-[500px]"
                        loading="lazy"
                    />
                ),
                a: ({ href, children }) => (
                    <a
                        href={href}
                        className="text-accent-orange hover:underline font-medium"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                        {children}
                    </a>
                ),
                h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 text-slate-800 mt-8">{children}</h1>,
                h2: ({ children }) => <h2 className="section-title mt-12">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold mb-3 text-slate-700 mt-8">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-slate-600">{children}</li>,
                p: ({ children }) => <p className="mb-4 text-slate-600 leading-relaxed">{children}</p>,
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

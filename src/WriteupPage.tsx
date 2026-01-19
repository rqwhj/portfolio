import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import "highlight.js/styles/github-dark.css";

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 15 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] as any },
  },
};

interface WriteupPageProps {
  file: string;
  title: string;
}

const WriteupPage: React.FC<WriteupPageProps> = ({ file, title }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(file)
      .then((res) => res.text())
      .then((text) => {
        const transformed = text.replace(/==(.+?)==/g, "<mark>$1</mark>");
        setContent(transformed);
      });
  }, [file]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] as any }}
      className="max-w-2xl mx-auto px-6 py-12 font-literata text-[15px] leading-[1.6] tracking-tight text-black bg-white"
    >
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.h1
          variants={item}
          className="text-[20px] font-medium mb-6 tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.div variants={item} className="space-y-5">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-[22px] font-medium mt-8 mb-3" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-[18px] font-medium mt-8 mb-3" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="my-3 leading-[1.6]" {...props} />
              ),
              code: ({ node, inline, className, children, ...props }: any) => (
                <code
                  className={
                    inline
                      ? "bg-gray-100 text-gray-900 px-[3px] py-[1px] rounded text-[14px]"
                      : "block bg-[#1c1f26] text-[#d1d5db] rounded-lg p-3 overflow-x-auto text-[14px]"
                  }
                  {...props}
                >
                  {children}
                </code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default WriteupPage;

import markdownStyles from "./markdown-styles.module.css";

export default function PostBody({ content }) {
  return (
    <div className="max-w-2xl mx-auto tracking-wide">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

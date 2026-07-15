import { useEffect } from "react";

const DEFAULT_TITLE = "ARXON - The Future of Private, Fast, and Secure Transactions";
const DEFAULT_DESCRIPTION =
  "Privacy chain for the people. Fast, secure, and private blockchain transactions at scale. Mine $ARX and join the network.";

export const PageMeta = ({
  title,
  description = DEFAULT_DESCRIPTION,
}: {
  title: string;
  description?: string;
}) => {
  useEffect(() => {
    document.title = title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    return () => {
      document.title = DEFAULT_TITLE;
      if (descEl) descEl.setAttribute("content", DEFAULT_DESCRIPTION);
      if (ogTitle) ogTitle.setAttribute("content", DEFAULT_TITLE);
      if (ogDesc) ogDesc.setAttribute("content", DEFAULT_DESCRIPTION);
    };
  }, [title, description]);

  return null;
};

export default PageMeta;

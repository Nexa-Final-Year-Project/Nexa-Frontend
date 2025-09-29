import React, { useState } from "react";

interface LinkMenuProps {
  editor: {
    getAttributes: (type: string) => { href?: string };
    chain: () => {
      focus: () => any;
      setLink: (opts: { href: string; target: string }) => any;
      run: () => void;
    };
  };
  onClose: () => void;
}

export default function LinkMenu({ editor, onClose }: LinkMenuProps) {
  const [url, setUrl] = useState(editor.getAttributes("link").href || "");

  const applyLink = () => {
    if (url.trim()) {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
    onClose();
  };

  return (
    <div className="flex items-center gap-1">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://"
        className="border rounded px-2 py-1 text-sm w-40"
      />
      <button
        onClick={applyLink}
        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
      >
        Apply
      </button>
      <button onClick={onClose} className="text-gray-500 text-sm">
        Cancel
      </button>
    </div>
  );
}

import { useState } from "react";

export default function TagsInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInputValue("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tags (Press Enter or comma to add)
      </label>
      <div className="flex flex-wrap gap-2 p-3 border-2 border-dashed border-stone-600 rounded-sm cursor-auto hover:border-blue-400 transition-all bg-stone-800">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center  px-2 py-0.5 bg-blue-500/50 text-stone-200 rounded-sm text-sm"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:text-red-600 !px-0 !py-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-white"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Suggested: design, illustration, photography, ui/ux, 3d, animation
      </p>
    </div>
  );
}
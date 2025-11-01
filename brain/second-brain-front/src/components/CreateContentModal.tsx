import { useState, useRef, forwardRef } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button.tsx";
import axios from "axios";
import { BACKEND_URL } from "../config";

// controlled content
enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
}

export function CreateContentModal({ open, onClose }) {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const linkRef = useRef<HTMLInputElement | null>(null);
  const [type, setType] = useState(ContentType.Youtube);

  async function AddContent() {
    try {
      const link = linkRef.current?.value;
      const title = titleRef.current?.value;
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in!");
        return;
      }

      await axios.post(
        `${BACKEND_URL}/api/v1/brain/content`,
        {
          link,
          title,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ fixed format
          },
        }
      );

      alert("Content added successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to add content. Please check your token or login again.");
    }
  }

  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-slate-400 fixed top-0 left-0 opacity-40 flex justify-center">
          <div className="flex flex-col justify-center">
            <span className="bg-white opacity-100 p-4 rounded">
              <div className="flex justify-end mb-6">
                <div onClick={onClose} className="cursor-pointer">
                  <CrossIcon />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  ref={titleRef}
                  placeholder="Title"
                  className="placeholder:font-bold placeholder:text-black"
                />
                <Input
                  ref={linkRef}
                  placeholder="Link"
                  className="placeholder:font-bold placeholder:text-black"
                />
              </div>

              <div>
                <Button
                  text="YouTube"
                  variant={type === ContentType.Youtube ? "primary" : "secondary"}
                  onClick={() => setType(ContentType.Youtube)}
                />
                <Button
                  text="Twitter"
                  variant={type === ContentType.Twitter ? "primary" : "secondary"}
                  onClick={() => setType(ContentType.Twitter)}
                />
              </div>

              <div className="flex flex-col items-center">
                <Button onClick={AddContent} variant="primary" text="Submit" />
              </div>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ Fixed Input component using forwardRef
const Input = forwardRef<HTMLInputElement, { placeholder: string; className?: string }>(
  ({ placeholder, className }, ref) => {
    return (
      <input
        ref={ref}
        placeholder={placeholder}
        type="text"
        className={`px-4 py-2 ${className}`}
      />
    );
  }
);

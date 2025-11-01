import React from "react";

type InputProps = {
    placeholder: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    type?: string;
    className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    placeholder, 
    onChange = () => {}, 
    onKeyDown, 
    type = "text", 
    className = "",
    ...props 
  }, ref) => {
    return (
      <div className={className}>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          {...props}
        />
      </div>
    );
  }
);
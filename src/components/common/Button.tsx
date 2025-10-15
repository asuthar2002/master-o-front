import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BlobButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const BlobButton = ({ children, className = "", ...rest }: BlobButtonProps) => {
  return (
    <button
      {...rest}
      className={`blob-btn relative inline-flex items-center justify-center ${className}`}
    >
      <span className="blob-btn__inner absolute inset-0 -z-10 overflow-hidden  bg-white">
        <span className="blob-btn__blobs relative block h-full">
          <span className="blob-btn__blob"></span>
          <span className="blob-btn__blob"></span>
          <span className="blob-btn__blob"></span>
          <span className="blob-btn__blob"></span>
        </span>
      </span>
      {children}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
    </button>
  );
};

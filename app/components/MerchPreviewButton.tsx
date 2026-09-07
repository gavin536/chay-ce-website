"use client";

import { useEffect, useId, useRef, useState } from "react";

export function MerchPreviewButton() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="secondary-button merch-preview-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Merch Coming Soon
      </button>

      {isOpen ? (
        <div
          className="merch-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            className="merch-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              ref={closeButtonRef}
              className="merch-modal-close"
              type="button"
              aria-label="Close merch preview"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
            <p className="panel-kicker" id={titleId}>Merch Preview</p>
            <img src="/images/Merch.png" alt="CHAY_CE merch preview" />
          </div>
        </div>
      ) : null}
    </>
  );
}

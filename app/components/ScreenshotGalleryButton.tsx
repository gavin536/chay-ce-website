"use client";

import { useEffect, useId, useRef, useState } from "react";

type ScreenshotGalleryButtonProps = {
  addonName: string;
  screenshots: readonly string[];
};

export function ScreenshotGalleryButton({ addonName, screenshots }: ScreenshotGalleryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasMultipleScreenshots = screenshots.length > 1;

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

      if (event.key === "ArrowLeft") {
        setActiveIndex((currentIndex) => getPreviousIndex(currentIndex, screenshots.length));
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((currentIndex) => getNextIndex(currentIndex, screenshots.length));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, screenshots.length]);

  if (screenshots.length === 0) {
    return null;
  }

  const activeScreenshot = screenshots[activeIndex] ?? screenshots[0];

  return (
    <>
      <button
        className="screenshot-button"
        type="button"
        onClick={() => {
          setActiveIndex(0);
          setIsOpen(true);
        }}
      >
        Screenshots
      </button>

      {isOpen ? (
        <div
          className="screenshot-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            className="screenshot-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              ref={closeButtonRef}
              className="screenshot-modal-close"
              type="button"
              aria-label="Close screenshot gallery"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>

            <div className="screenshot-modal-header">
              <p className="panel-kicker">Screenshots</p>
              <h3 id={titleId}>{addonName}</h3>
              <span>{activeIndex + 1} / {screenshots.length}</span>
            </div>

            <div className="screenshot-stage">
              {hasMultipleScreenshots ? (
                <button
                  className="screenshot-nav screenshot-nav-prev"
                  type="button"
                  aria-label="Previous screenshot"
                  onClick={() => setActiveIndex((currentIndex) => getPreviousIndex(currentIndex, screenshots.length))}
                >
                  Prev
                </button>
              ) : null}

              <img src={activeScreenshot} alt={`${addonName} screenshot ${activeIndex + 1}`} />

              {hasMultipleScreenshots ? (
                <button
                  className="screenshot-nav screenshot-nav-next"
                  type="button"
                  aria-label="Next screenshot"
                  onClick={() => setActiveIndex((currentIndex) => getNextIndex(currentIndex, screenshots.length))}
                >
                  Next
                </button>
              ) : null}
            </div>

            {hasMultipleScreenshots ? (
              <div className="screenshot-thumbnails" aria-label={`${addonName} screenshot thumbnails`}>
                {screenshots.map((screenshot, index) => (
                  <button
                    key={screenshot}
                    className={index === activeIndex ? "screenshot-thumbnail screenshot-thumbnail-active" : "screenshot-thumbnail"}
                    type="button"
                    aria-label={`Show screenshot ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img src={screenshot} alt="" aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function getPreviousIndex(currentIndex: number, total: number) {
  return total > 0 ? (currentIndex - 1 + total) % total : 0;
}

function getNextIndex(currentIndex: number, total: number) {
  return total > 0 ? (currentIndex + 1) % total : 0;
}

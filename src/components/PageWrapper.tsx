import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "input",
  "textarea",
  "select",
  "button",
  "a",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

export default function PageWrapper({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollFocusedElementIntoView = (target: HTMLElement) => {
      const navOffset = 104;
      const topMargin = navOffset + 20;
      const bottomMargin = 48;
      const rect = target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isAboveView = rect.top < topMargin;
      const isBelowView = rect.bottom > viewportHeight - bottomMargin;

      if (!isAboveView && !isBelowView) return;

      const elementHeight = Math.max(rect.height, 40);
      const targetTop = window.scrollY + rect.top - navOffset - Math.max(24, viewportHeight * 0.18) - elementHeight * 0.2;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    };

    const queueScrollCheck = (target: HTMLElement) => {
      window.requestAnimationFrame(() => {
        window.setTimeout(() => scrollFocusedElementIntoView(target), 30);
      });
    };

    const resolveFocusableTarget = (node: EventTarget | null) => {
      if (!(node instanceof HTMLElement)) return null;
      const focusableTarget = node.matches(FOCUSABLE_SELECTOR) ? node : node.closest<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusableTarget) return null;
      if (!containerRef.current?.contains(focusableTarget)) return null;
      return focusableTarget;
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = resolveFocusableTarget(event.target);
      if (!target) return;
      queueScrollCheck(target);
    };

    const handlePointerUp = (event: PointerEvent) => {
      const target = resolveFocusableTarget(event.target);
      if (!target) return;
      queueScrollCheck(target);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: 14, rotate: 0.2 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      exit={{ opacity: 0, x: -14, rotate: -0.2 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="container learning-trail max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:py-10"
    >
      {children}
    </motion.div>
  );
}

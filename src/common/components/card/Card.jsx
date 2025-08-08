import { Card as MantineCard } from "@mantine/core";
import styles from "./Card.module.css";
import { useNavigate } from "react-router-dom";

export default function Card({ href, children, onClick, ...props }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    const interactiveElements = [
      "BUTTON",
      "A",
      "INPUT",
      "TEXTAREA",
      "SELECT",
      "svg",
      "path",
    ];
    const isInteractive = e.target.closest(interactiveElements.join(","));

    if (isInteractive) return;

    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <MantineCard
      withBorder
      shadow="md"
      radius="md"
      padding="lg"
      className={styles.card}
      component="div"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick(e);
        }
      }}
      style={{
        cursor: href || onClick ? "pointer" : "",
      }}
      href={href ? href : undefined}
      data-href={href ? href : undefined}
      tabIndex={href || onClick ? 0 : undefined}
      {...props}

    >
      {children}
    </MantineCard>
  );
}

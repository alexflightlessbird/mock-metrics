import { Card as MantineCard } from "@mantine/core";
import styles from "./Card.module.css";
import { useNavigate } from "react-router-dom";

export default function Card({ href, children }) {
    const navigate = useNavigate();

    return (
        <MantineCard
            withBorder
            shadow="md"
            radius="md"
            padding="lg"
            className={styles.card}
            component={href ? "a" : ""}
            href={href}
            onClick={(e) => {
                e.preventDefault();
                if (href) navigate(href);
            }}
            style={{
                cursor: href ? "pointer" : ""
            }}
        >
            {children}
        </MantineCard>
    )
}
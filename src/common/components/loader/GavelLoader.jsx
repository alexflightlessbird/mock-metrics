import { useIds } from "../../hooks/useIds";
import styles from "./GavelLoader.module.css";
import { isNumberLike, useMantineTheme } from "@mantine/core";

function NewGavelIcon({ fillColor = "#0a1f3c" }) {
  const ids = useIds(9);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      zoomAndPan="magnify"
      viewBox="0 0 375 374.999991"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      version="1.2"
      className={styles.gavel}
    >
      <defs>
        <clipPath id={`clip1-${ids[0]}`}>
          <path d="M 0 168.027344 L 293.722656 168.027344 L 293.722656 206.929688 L 0 206.929688 Z M 0 168.027344 " />
        </clipPath>
        <clipPath id={`clip2-${ids[1]}`}>
          <path d="M 293.722656 187.476562 C 293.722656 198.21875 285.015625 206.929688 274.269531 206.929688 L 19.445312 206.929688 C 8.703125 206.929688 -0.0078125 198.21875 -0.0078125 187.476562 C -0.0078125 176.734375 8.703125 168.027344 19.445312 168.027344 L 274.269531 168.027344 C 285.015625 168.027344 293.722656 176.734375 293.722656 187.476562 Z M 293.722656 187.476562 " />
        </clipPath>
        <clipPath id={`clip3-${ids[2]}`}>
          <path d="M 238.03125 125.398438 L 362.195312 125.398438 L 362.195312 249.558594 L 238.03125 249.558594 Z M 238.03125 125.398438 " />
        </clipPath>
        <clipPath id={`clip4-${ids[3]}`}>
          <path d="M 362.195312 132.148438 L 362.195312 242.808594 C 362.195312 244.597656 361.484375 246.316406 360.214844 247.582031 C 358.949219 248.847656 357.234375 249.558594 355.445312 249.558594 L 244.78125 249.558594 C 242.992188 249.558594 241.273438 248.847656 240.007812 247.582031 C 238.742188 246.316406 238.03125 244.597656 238.03125 242.808594 L 238.03125 132.148438 C 238.03125 130.355469 238.742188 128.640625 240.007812 127.375 C 241.273438 126.109375 242.992188 125.398438 244.78125 125.398438 L 355.445312 125.398438 C 357.234375 125.398438 358.949219 126.109375 360.214844 127.375 C 361.484375 128.640625 362.195312 130.355469 362.195312 132.148438 Z M 362.195312 132.148438 " />
        </clipPath>
        <clipPath id={`clip5-${ids[4]}`}>
          <path d="M 225.152344 266.984375 L 374.992188 266.984375 L 374.992188 305.890625 L 225.152344 305.890625 Z M 225.152344 266.984375 " />
        </clipPath>
        <clipPath id={`clip6-${ids[5]}`}>
          <path d="M 374.992188 286.4375 C 374.992188 297.179688 366.285156 305.890625 355.542969 305.890625 L 244.699219 305.890625 C 233.953125 305.890625 225.246094 297.179688 225.246094 286.4375 C 225.246094 275.695312 233.953125 266.984375 244.699219 266.984375 L 355.542969 266.984375 C 366.285156 266.984375 374.992188 275.695312 374.992188 286.4375 Z M 374.992188 286.4375 " />
        </clipPath>
        <clipPath id={`clip7-${ids[6]}`}>
          <path d="M 225.152344 69.109375 L 374.992188 69.109375 L 374.992188 108.015625 L 225.152344 108.015625 Z M 225.152344 69.109375 " />
        </clipPath>
        <clipPath id={`clip8-${ids[7]}`}>
          <path d="M 374.992188 88.5625 C 374.992188 99.304688 366.285156 108.015625 355.542969 108.015625 L 244.699219 108.015625 C 233.953125 108.015625 225.246094 99.304688 225.246094 88.5625 C 225.246094 77.820312 233.953125 69.109375 244.699219 69.109375 L 355.542969 69.109375 C 366.285156 69.109375 374.992188 77.820312 374.992188 88.5625 Z M 374.992188 88.5625 " />
        </clipPath>
      </defs>

      <g id={ids[8]}>
        <g clipRule="nonzero" clipPath={`url(#clip1-${ids[0]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip2-${ids[1]})`}>
            <path
              style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: fillColor,
                fillOpacity: 1,
              }}
              d="M 293.722656 168.027344 L 293.722656 206.929688 L -0.03125 206.929688 L -0.03125 168.027344 Z M 293.722656 168.027344 "
            />
          </g>
        </g>
        <g clipRule="nonzero" clipPath={`url(#clip3-${ids[2]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip4-${ids[3]})`}>
            <path
              style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: fillColor,
                fillOpacity: 1,
              }}
              d="M 362.195312 125.398438 L 362.195312 249.558594 L 238.03125 249.558594 L 238.03125 125.398438 Z M 362.195312 125.398438 "
            />
          </g>
        </g>
        <g clipRule="nonzero" clipPath={`url(#clip5-${ids[4]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip6-${ids[5]})`}>
            <path
              style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: fillColor,
                fillOpacity: 1,
              }}
              d="M 374.992188 266.984375 L 374.992188 305.890625 L 225.304688 305.890625 L 225.304688 266.984375 Z M 374.992188 266.984375 "
            />
          </g>
        </g>
        <g clipRule="nonzero" clipPath={`url(#clip7-${ids[6]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip8-${ids[7]})`}>
            <path
              style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: fillColor,
                fillOpacity: 1,
              }}
              d="M 374.992188 69.109375 L 374.992188 108.015625 L 225.304688 108.015625 L 225.304688 69.109375 Z M 374.992188 69.109375 "
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

function NewPanelIcon({
  topFillColor = "#0a1f3c",
  bottomFillColor = "#0a1f3c",
}) {
  const ids = useIds(5);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      zoomAndPan="magnify"
      viewBox="0 0 375 374.999991"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      version="1.2"
      className={styles.panel}
    >
      <defs>
        <clipPath id={`clip1-${ids[0]}`}>
          <path d="M 89.769531 157.285156 L 285.1875 157.285156 L 285.1875 184.742188 L 89.769531 184.742188 Z M 89.769531 157.285156 " />
        </clipPath>
        <clipPath id={`clip2-${ids[1]}`}>
          <path d="M 285.1875 171.015625 C 285.1875 174.65625 283.742188 178.148438 281.167969 180.722656 C 278.59375 183.296875 275.101562 184.742188 271.460938 184.742188 L 103.519531 184.742188 C 99.878906 184.742188 96.386719 183.296875 93.8125 180.722656 C 91.238281 178.148438 89.792969 174.65625 89.792969 171.015625 C 89.792969 167.375 91.238281 163.882812 93.8125 161.308594 C 96.386719 158.734375 99.878906 157.285156 103.519531 157.285156 L 271.460938 157.285156 C 275.101562 157.285156 278.59375 158.734375 281.167969 161.308594 C 283.742188 163.882812 285.1875 167.375 285.1875 171.015625 Z M 285.1875 171.015625 " />
        </clipPath>
        <clipPath id={`clip3-${ids[2]}`}>
          <path d="M 66.964844 183.242188 L 308.011719 183.242188 L 308.011719 217.714844 L 66.964844 217.714844 Z M 66.964844 183.242188 " />
        </clipPath>
        <clipPath id={`clip4-${ids[3]}`}>
          <path d="M 308.011719 200.476562 C 308.011719 209.996094 300.292969 217.714844 290.773438 217.714844 L 84.207031 217.714844 C 74.6875 217.714844 66.96875 209.996094 66.96875 200.476562 C 66.96875 190.957031 74.6875 183.242188 84.207031 183.242188 L 290.773438 183.242188 C 300.292969 183.242188 308.011719 190.957031 308.011719 200.476562 Z M 308.011719 200.476562 " />
        </clipPath>
      </defs>

      <g id={ids[4]}>
        <g clipRule="nonzero" clipPath={`url(#clip1-${ids[0]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip2-${ids[1]})`}>
            <path
              style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: topFillColor,
                fillOpacity: 1,
              }}
              d="M 285.1875 157.285156 L 285.1875 184.742188 L 89.769531 184.742188 L 89.769531 157.285156 Z M 285.1875 157.285156 "
            />
          </g>
        </g>
        <g clipRule="nonzero" clipPath={`url(#clip3-${ids[2]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip4-${ids[3]})`}>
            <path
              style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: bottomFillColor,
                fillOpacity: 1,
              }}
              d="M 308.011719 183.242188 L 308.011719 217.714844 L 66.964844 217.714844 L 66.964844 183.242188 Z M 308.011719 183.242188 "
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default function LoadingAnimation({
  gavelColor,
  topPanelColor,
  bottomPanelColor,
  allColors,
  scale = 1,
}) {
  const theme = useMantineTheme();
  if (!isNumberLike(scale)) scale = 1;
  scale = Math.abs(Number(scale));

  if (!allColors) {
    if (!gavelColor) gavelColor = theme.colors.blue[6];
    if (!topPanelColor) topPanelColor = theme.colors.blue[6];
    if (!bottomPanelColor) bottomPanelColor = theme.colors.blue[6];
  } else {
    gavelColor = allColors;
    topPanelColor = allColors;
    bottomPanelColor = allColors;
  }


  return (
    <div className={`${styles.container}`} aria-label="Loading...">
      <div
        className={styles.animationContainer}
        style={{ "--scale-size": scale }}
        aria-hidden="true"
      >
        <div className={styles.gavelContainer}>
          <NewGavelIcon fillColor={gavelColor} />
        </div>
        <div className={styles.panelContainer}>
          <NewPanelIcon
            bottomFillColor={bottomPanelColor}
            topFillColor={topPanelColor}
          />
        </div>
      </div>
    </div>
  );
}

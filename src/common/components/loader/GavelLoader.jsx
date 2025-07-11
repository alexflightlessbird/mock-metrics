import { useIds } from "../../hooks/useIds";
import styles from './GavelLoader.module.css';
import { isNumberLike, useMantineTheme } from "@mantine/core";

function NewGavelIcon ({ fillColor = "#0a1f3c" }) {
  const ids = useIds(9);

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="100%" 
      zoomAndPan="magnify" 
      viewBox="0 0 375 374.999991" 
      height="100%"
      preserveAspectRatio="xMidYMid meet" 
      version="1.2"
      className={styles.gavel}
    >
      <defs>
        <clipPath id={`clip1-${ids[0]}`}><path d="M 0 168.027344 L 293.722656 168.027344 L 293.722656 206.929688 L 0 206.929688 Z M 0 168.027344 "/></clipPath>
        <clipPath id={`clip2-${ids[1]}`}><path d="M 293.722656 187.476562 C 293.722656 198.21875 285.015625 206.929688 274.269531 206.929688 L 19.445312 206.929688 C 8.703125 206.929688 -0.0078125 198.21875 -0.0078125 187.476562 C -0.0078125 176.734375 8.703125 168.027344 19.445312 168.027344 L 274.269531 168.027344 C 285.015625 168.027344 293.722656 176.734375 293.722656 187.476562 Z M 293.722656 187.476562 "/></clipPath>
        <clipPath id={`clip3-${ids[2]}`}><path d="M 238.03125 125.398438 L 362.195312 125.398438 L 362.195312 249.558594 L 238.03125 249.558594 Z M 238.03125 125.398438 "/></clipPath>
        <clipPath id={`clip4-${ids[3]}`}><path d="M 362.195312 132.148438 L 362.195312 242.808594 C 362.195312 244.597656 361.484375 246.316406 360.214844 247.582031 C 358.949219 248.847656 357.234375 249.558594 355.445312 249.558594 L 244.78125 249.558594 C 242.992188 249.558594 241.273438 248.847656 240.007812 247.582031 C 238.742188 246.316406 238.03125 244.597656 238.03125 242.808594 L 238.03125 132.148438 C 238.03125 130.355469 238.742188 128.640625 240.007812 127.375 C 241.273438 126.109375 242.992188 125.398438 244.78125 125.398438 L 355.445312 125.398438 C 357.234375 125.398438 358.949219 126.109375 360.214844 127.375 C 361.484375 128.640625 362.195312 130.355469 362.195312 132.148438 Z M 362.195312 132.148438 "/></clipPath>
        <clipPath id={`clip5-${ids[4]}`}><path d="M 225.152344 266.984375 L 374.992188 266.984375 L 374.992188 305.890625 L 225.152344 305.890625 Z M 225.152344 266.984375 "/></clipPath>
        <clipPath id={`clip6-${ids[5]}`}><path d="M 374.992188 286.4375 C 374.992188 297.179688 366.285156 305.890625 355.542969 305.890625 L 244.699219 305.890625 C 233.953125 305.890625 225.246094 297.179688 225.246094 286.4375 C 225.246094 275.695312 233.953125 266.984375 244.699219 266.984375 L 355.542969 266.984375 C 366.285156 266.984375 374.992188 275.695312 374.992188 286.4375 Z M 374.992188 286.4375 "/></clipPath>
        <clipPath id={`clip7-${ids[6]}`}><path d="M 225.152344 69.109375 L 374.992188 69.109375 L 374.992188 108.015625 L 225.152344 108.015625 Z M 225.152344 69.109375 "/></clipPath>
        <clipPath id={`clip8-${ids[7]}`}><path d="M 374.992188 88.5625 C 374.992188 99.304688 366.285156 108.015625 355.542969 108.015625 L 244.699219 108.015625 C 233.953125 108.015625 225.246094 99.304688 225.246094 88.5625 C 225.246094 77.820312 233.953125 69.109375 244.699219 69.109375 L 355.542969 69.109375 C 366.285156 69.109375 374.992188 77.820312 374.992188 88.5625 Z M 374.992188 88.5625 "/></clipPath>
      </defs>
      
      <g id={ids[8]}>
        <g clip-rule="nonzero" clip-path={`url(#clip1-${ids[0]})`}>
          <g clip-rule="nonzero" clip-path={`url(#clip2-${ids[1]})`}>
            <path style={{ stroke: "none", fillRule: "nonzero", fill: fillColor, fillOpacity: 1 }} d="M 293.722656 168.027344 L 293.722656 206.929688 L -0.03125 206.929688 L -0.03125 168.027344 Z M 293.722656 168.027344 "/>
          </g>
        </g>
        <g clip-rule="nonzero" clip-path={`url(#clip3-${ids[2]})`}>
          <g clip-rule="nonzero" clip-path={`url(#clip4-${ids[3]})`}>
            <path style={{ stroke: "none", fillRule: "nonzero", fill: fillColor, fillOpacity: 1 }} d="M 362.195312 125.398438 L 362.195312 249.558594 L 238.03125 249.558594 L 238.03125 125.398438 Z M 362.195312 125.398438 "/>
          </g>
        </g>
        <g clip-rule="nonzero" clip-path={`url(#clip5-${ids[4]})`}>
          <g clip-rule="nonzero" clip-path={`url(#clip6-${ids[5]})`}>
            <path style={{ stroke: "none", fillRule: "nonzero", fill: fillColor, fillOpacity: 1 }} d="M 374.992188 266.984375 L 374.992188 305.890625 L 225.304688 305.890625 L 225.304688 266.984375 Z M 374.992188 266.984375 "/>
          </g>
        </g>
        <g clip-rule="nonzero" clip-path={`url(#clip7-${ids[6]})`}>
          <g clip-rule="nonzero" clip-path={`url(#clip8-${ids[7]})`}>
            <path style={{ stroke: "none", fillRule: "nonzero", fill: fillColor, fillOpacity: 1 }} d="M 374.992188 69.109375 L 374.992188 108.015625 L 225.304688 108.015625 L 225.304688 69.109375 Z M 374.992188 69.109375 "/>
          </g>
        </g>
      </g>
    </svg>
  )
}

function NewPanelIcon ({ fillColor = "#0a1f3c" }) {
  const ids = useIds(5);

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="100%"
      zoomAndPan="magnify" 
      viewBox="0 0 375 374.999991" 
      height="100%"
      preserveAspectRatio="xMidYMid meet" 
      version="1.2"
      className={styles.panel}
    >
      <defs>
        <clipPath id={`clip1-${ids[0]}`}><path d="M 89.769531 157.285156 L 285.1875 157.285156 L 285.1875 184.742188 L 89.769531 184.742188 Z M 89.769531 157.285156 "/></clipPath>
        <clipPath id={`clip2-${ids[1]}`}><path d="M 285.1875 171.015625 C 285.1875 174.65625 283.742188 178.148438 281.167969 180.722656 C 278.59375 183.296875 275.101562 184.742188 271.460938 184.742188 L 103.519531 184.742188 C 99.878906 184.742188 96.386719 183.296875 93.8125 180.722656 C 91.238281 178.148438 89.792969 174.65625 89.792969 171.015625 C 89.792969 167.375 91.238281 163.882812 93.8125 161.308594 C 96.386719 158.734375 99.878906 157.285156 103.519531 157.285156 L 271.460938 157.285156 C 275.101562 157.285156 278.59375 158.734375 281.167969 161.308594 C 283.742188 163.882812 285.1875 167.375 285.1875 171.015625 Z M 285.1875 171.015625 "/></clipPath>
        <clipPath id={`clip3-${ids[2]}`}><path d="M 66.964844 183.242188 L 308.011719 183.242188 L 308.011719 217.714844 L 66.964844 217.714844 Z M 66.964844 183.242188 "/></clipPath>
        <clipPath id={`clip4-${ids[3]}`}><path d="M 308.011719 200.476562 C 308.011719 209.996094 300.292969 217.714844 290.773438 217.714844 L 84.207031 217.714844 C 74.6875 217.714844 66.96875 209.996094 66.96875 200.476562 C 66.96875 190.957031 74.6875 183.242188 84.207031 183.242188 L 290.773438 183.242188 C 300.292969 183.242188 308.011719 190.957031 308.011719 200.476562 Z M 308.011719 200.476562 "/></clipPath>
      </defs>
      
      <g id={ids[4]}>
        <g clip-rule="nonzero" clip-path={`url(#clip1-${ids[0]})`}>
          <g clip-rule="nonzero" clip-path={`url(#clip2-${ids[1]})`}>
            <path style={{ stroke: "none", fillRule: "nonzero", fill: fillColor, fillOpacity: 1 }} d="M 285.1875 157.285156 L 285.1875 184.742188 L 89.769531 184.742188 L 89.769531 157.285156 Z M 285.1875 157.285156 "/>
          </g>
        </g>
        <g clip-rule="nonzero" clip-path={`url(#clip3-${ids[2]})`}>
          <g clip-rule="nonzero" clip-path={`url(#clip4-${ids[3]})`}>
            <path style={{ stroke: "none", fillRule: "nonzero", fill: fillColor, fillOpacity: 1 }} d="M 308.011719 183.242188 L 308.011719 217.714844 L 66.964844 217.714844 L 66.964844 183.242188 Z M 308.011719 183.242188 "/>
          </g>
        </g>
      </g>
    </svg>
  )
}


function GavelIcon ({ fillColor = "#0a1f3c" }) {
  const ids = useIds(12);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.2" className={styles.gavel}>
      <defs>
        <clipPath id={`clip1-${ids[0]}`}><path d="M 8 140 L 235 140 L 235 367 L 8 367 Z M 8 140 "/></clipPath>
        <clipPath id={`clip2-${ids[1]}`}><path d="M 214.769531 131.785156 L 243.214844 160.230469 L 28.425781 375.019531 L -0.0234375 346.574219 Z M 214.769531 131.785156 "/></clipPath>
        <clipPath id={`clip3-${ids[2]}`}><path d="M 228.992188 146.007812 C 236.847656 153.863281 236.847656 166.597656 228.992188 174.453125 L 42.664062 360.78125 C 34.808594 368.636719 22.074219 368.636719 14.21875 360.78125 C 6.363281 352.925781 6.363281 340.1875 14.21875 332.332031 L 200.542969 146.007812 C 208.398438 138.152344 221.136719 138.152344 228.992188 146.007812 Z M 228.992188 146.007812 "/></clipPath>
        <clipPath id={`clip4-${ids[3]}`}><path d="M 145 53 L 322 53 L 322 230 L 145 230 Z M 145 53 "/></clipPath>
        <clipPath id={`clip5-${ids[4]}`}><path d="M 233.664062 49.835938 L 324.804688 140.976562 L 233.664062 232.117188 L 142.527344 140.976562 Z M 233.664062 49.835938 "/></clipPath>
        <clipPath id={`clip6-${ids[5]}`}><path d="M 238.4375 55.320312 L 319.679688 136.558594 C 322.3125 139.195312 322.3125 143.46875 319.679688 146.105469 L 238.4375 227.34375 C 235.804688 229.980469 231.527344 229.980469 228.894531 227.34375 L 147.652344 146.105469 C 145.019531 143.46875 145.019531 139.195312 147.652344 136.558594 L 228.894531 55.320312 C 231.527344 52.683594 235.804688 52.683594 238.4375 55.320312 Z M 238.4375 55.320312 "/></clipPath>
        <clipPath id={`clip7-${ids[6]}`}><path d="M 245 153 L 367 153 L 367 275 L 245 275 Z M 245 153 "/></clipPath>
        <clipPath id={`clip8-${ids[7]}`}><path d="M 346.550781 144.71875 L 374.996094 173.164062 L 265.433594 282.726562 L 236.988281 254.28125 Z M 346.550781 144.71875 "/></clipPath>
        <clipPath id={`clip9-${ids[8]}`}><path d="M 360.773438 158.941406 C 368.628906 166.796875 368.628906 179.535156 360.773438 187.386719 L 279.726562 268.4375 C 271.871094 276.292969 259.132812 276.292969 251.277344 268.4375 C 243.421875 260.582031 243.421875 247.847656 251.277344 239.992188 L 332.328125 158.941406 C 340.183594 151.085938 352.917969 151.085938 360.773438 158.941406 Z M 360.773438 158.941406 "/></clipPath>
        <clipPath id={`clip10-${ids[9]}`}><path d="M 100 8 L 222 8 L 222 130 L 100 130 Z M 100 8 "/></clipPath>
        <clipPath id={`clip11-${ids[10]}`}><path d="M 201.867188 0.0351562 L 230.3125 28.480469 L 120.75 138.042969 L 92.304688 109.597656 Z M 201.867188 0.0351562 "/></clipPath>
        <clipPath id={`clip12-${ids[11]}`}><path d="M 216.089844 14.257812 C 223.945312 22.113281 223.945312 34.847656 216.089844 42.703125 L 135.039062 123.753906 C 127.183594 131.609375 114.449219 131.609375 106.59375 123.753906 C 98.738281 115.898438 98.738281 103.160156 106.59375 95.304688 L 187.640625 14.257812 C 195.496094 6.402344 208.234375 6.402344 216.089844 14.257812 Z M 216.089844 14.257812 "/></clipPath>
      </defs>
      <g id="7567ee57fd">
        <g clipRule="nonzero" clipPath={`url(#clip1-${ids[0]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip2-${ids[1]})`}>
            <g clipRule="nonzero" clipPath={`url(#clip3-${ids[2]})`}>
              <path style={{ stroke: 'none', fillRule: 'nonzero', fill: fillColor, fillOpacity: 1 }} d="M 214.769531 131.785156 L 243.214844 160.230469 L 28.425781 375.019531 L -0.0234375 346.574219 Z M 214.769531 131.785156 "/>
            </g>
          </g>
        </g>
        <g clipRule="nonzero" clipPath={`url(#clip4-${ids[3]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip5-${ids[4]})`}>
            <g clipRule="nonzero" clipPath={`url(#clip6-${ids[5]})`}>
              <path style={{ stroke: 'none', fillRule: 'nonzero', fill: fillColor, fillOpacity: 1 }} d="M 233.664062 50.546875 L 324.449219 141.332031 L 233.664062 232.117188 L 142.882812 141.332031 Z M 233.664062 50.546875 "/>
            </g>
          </g>
        </g>
        <g clipRule="nonzero" clipPath={`url(#clip7-${ids[6]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip8-${ids[7]})`}>
            <g clipRule="nonzero" clipPath={`url(#clip9-${ids[8]})`}>
              <path style={{ stroke: 'none', fillRule: 'nonzero', fill: fillColor, fillOpacity: 1 }} d="M 346.550781 144.71875 L 374.996094 173.164062 L 265.546875 282.617188 L 237.097656 254.171875 Z M 346.550781 144.71875 "/>
            </g>
          </g>
        </g>
        <g clipRule="nonzero" clipPath={`url(#clip10-${ids[9]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip11-${ids[10]})`}>
            <g clipRule="nonzero" clipPath={`url(#clip12-${ids[11]})`}>
              <path style={{ stroke: 'none', fillRule: 'nonzero', fill: fillColor, fillOpacity: 1 }} d="M 201.867188 0.0351562 L 230.3125 28.480469 L 120.859375 137.933594 L 92.414062 109.484375 Z M 201.867188 0.0351562 "/>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

const PanelIcon = ({ fillColor = "#0a1f3c", className }) => {
  const ids = useIds(2);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="500" zoomAndPan="magnify" viewBox="0 0 375 374.999991" height="500" preserveAspectRatio="xMidYMid meet" version="1.2" className={className}>
      <defs>
        <clipPath id={`clip1-${ids[0]}`}><path d="M 66.828125 167.4375 L 308.011719 167.4375 L 308.011719 207.558594 L 66.828125 207.558594 Z M 66.828125 167.4375 "/></clipPath>
        <clipPath id={`clip2-${ids[1]}`}><path d="M 308.011719 187.5 C 308.011719 198.578125 299.03125 207.558594 287.953125 207.558594 L 87.03125 207.558594 C 75.953125 207.558594 66.972656 198.578125 66.972656 187.5 C 66.972656 176.417969 75.953125 167.4375 87.03125 167.4375 L 287.953125 167.4375 C 299.03125 167.4375 308.011719 176.417969 308.011719 187.5 Z M 308.011719 187.5 "/></clipPath>
      </defs>
      <g id="46ee357782">
        <g clipRule="nonzero" clipPath={`url(#clip1-${ids[0]})`}>
          <g clipRule="nonzero" clipPath={`url(#clip2-${ids[1]})`}>
            <path style={{ stroke: 'none', fillRule: 'nonzero', fill: fillColor, fillOpacity: 1 }} d="M 308.011719 167.4375 L 308.011719 207.558594 L 66.984375 207.558594 L 66.984375 167.4375 Z M 308.011719 167.4375 "/>
          </g>
        </g>
      </g>
    </svg>
  );
}

const LoadingAnimation = ({ gavelColor, panelColor, bottomPanelColor, scale = 10 }) => {
  const theme = useMantineTheme();
  if (!isNumberLike(scale)) scale = 1;

  if (!gavelColor) gavelColor = theme.colors.blue[6];
  if (!panelColor) panelColor = theme.colors.blue[6];
  if (!bottomPanelColor) bottomPanelColor = theme.colors.blue[6];

  return (
    <>
    <div className={styles.container}>
      <div className={styles.animationContainer} style={{ "--scale-size": scale }}>
        <div className={styles.gavelContainer}>
          <NewGavelIcon fillColor={gavelColor} />
        </div>
        <div className={styles.panelContainer}>
          <NewPanelIcon fillColor={panelColor} />
        </div>
      </div>
    </div>
    </>
  );
};

export default LoadingAnimation;
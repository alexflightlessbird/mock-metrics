import { useIds } from "../../common/hooks/useIds"

export default function Logo ({ backgroundColor = "#0a1f3c", borderColor = "#f7f5f3", insideBorderColor = "#0a1f3c", gavelColor = "#f7f5f3", barsColor = "#2dace6" }) {
    const ids = useIds(33);

    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            width="500" 
            zoomAndPan="magnify" 
            viewBox="0 0 375 374.999991" 
            height="500" 
            preserveAspectRatio="xMidYMid meet" 
            version="1.2"
        >
            <defs>
                <clipPath id={`clip1-${ids[0]}`}><path d="M 61.113281 19.265625 L 318.917969 19.265625 L 318.917969 356 L 61.113281 356 Z M 61.113281 19.265625 "/></clipPath>
                <clipPath id={`clip2-${ids[1]}`}><path d="M 318.917969 310.414062 L 318.917969 19.265625 L 61.113281 19.265625 L 61.113281 310.414062 L 190.015625 355.742188 Z M 318.917969 310.414062 "/></clipPath>
                <clipPath id={`clip3-${ids[2]}`}><path d="M 84.125 269.503906 L 96.359375 269.503906 L 96.359375 323.183594 L 84.125 323.183594 Z M 84.125 269.503906 "/></clipPath>
                <clipPath id={`clip4-${ids[3]}`}><path d="M 102.476562 254.941406 L 114.707031 254.941406 L 114.707031 327.101562 L 102.476562 327.101562 Z M 102.476562 254.941406 "/></clipPath>
                <clipPath id={`clip5-${ids[4]}`}><path d="M 120.714844 243.808594 L 132.949219 243.808594 L 132.949219 332.710938 L 120.714844 332.710938 Z M 120.714844 243.808594 "/></clipPath>
                <clipPath id={`clip6-${ids[5]}`}><path d="M 138.957031 231.683594 L 151.191406 231.683594 L 151.191406 341.371094 L 138.957031 341.371094 Z M 138.957031 231.683594 "/></clipPath>
                <clipPath id={`clip7-${ids[6]}`}><path d="M 157.199219 218.691406 L 169.433594 218.691406 L 169.433594 346.855469 L 157.199219 346.855469 Z M 157.199219 218.691406 "/></clipPath>
                <clipPath id={`clip8-${ids[7]}`}><path d="M 175.441406 238.035156 L 187.675781 238.035156 L 187.675781 354.882812 L 175.441406 354.882812 Z M 175.441406 238.035156 "/></clipPath>
                <clipPath id={`clip9-${ids[8]}`}><path d="M 193.683594 281.058594 L 205.914062 281.058594 L 205.914062 353.050781 L 193.683594 353.050781 Z M 193.683594 281.058594 "/></clipPath>
                <clipPath id={`clip10-${ids[9]}`}><path d="M 211.921875 291.023438 L 224.15625 291.023438 L 224.15625 346.855469 L 211.921875 346.855469 Z M 211.921875 291.023438 "/></clipPath>
                <clipPath id={`clip11-${ids[10]}`}><path d="M 230.164062 277.578125 L 242.398438 277.578125 L 242.398438 338.609375 L 230.164062 338.609375 Z M 230.164062 277.578125 "/></clipPath>
                <clipPath id={`clip12-${ids[11]}`}><path d="M 248.40625 263.597656 L 260.640625 263.597656 L 260.640625 332.710938 L 248.40625 332.710938 Z M 248.40625 263.597656 "/></clipPath>
                <clipPath id={`clip13-${ids[12]}`}><path d="M 266.648438 254.941406 L 278.878906 254.941406 L 278.878906 327.101562 L 266.648438 327.101562 Z M 266.648438 254.941406 "/></clipPath>
                <clipPath id={`clip14-${ids[13]}`}><path d="M 284.886719 238.035156 L 297.121094 238.035156 L 297.121094 318.9375 L 284.886719 318.9375 Z M 284.886719 238.035156 "/></clipPath>
                <clipPath id={`clip15-${ids[14]}`}><path d="M 55 146 L 204 146 L 204 254 L 55 254 Z M 55 146 "/></clipPath>
                <clipPath id={`clip16-${ids[15]}`}><path d="M 191.363281 139.527344 L 210.367188 169.207031 L 68.113281 260.289062 L 49.109375 230.609375 Z M 191.363281 139.527344 "/></clipPath>
                <clipPath id={`clip17-${ids[16]}`}><path d="M 200.867188 154.367188 C 206.113281 162.5625 203.722656 173.460938 195.527344 178.707031 L 83.019531 250.746094 C 74.820312 255.992188 63.921875 253.605469 58.675781 245.40625 C 53.429688 237.210938 55.820312 226.3125 64.015625 221.066406 L 176.523438 149.027344 C 184.71875 143.78125 195.617188 146.171875 200.867188 154.367188 Z M 200.867188 154.367188 "/></clipPath>
                <clipPath id={`clip18-${ids[17]}`}><path d="M 130 76 L 281 76 L 281 227 L 130 227 Z M 130 76 "/></clipPath>
                <clipPath id={`clip19-${ids[18]}`}><path d="M 222.777344 73.558594 L 283.429688 168.28125 L 188.703125 228.929688 L 128.054688 134.207031 Z M 222.777344 73.558594 "/></clipPath>
                <clipPath id={`clip20-${ids[19]}`}><path d="M 226.417969 79.242188 L 279.789062 162.597656 C 281.800781 165.734375 280.882812 169.910156 277.742188 171.921875 L 194.390625 225.292969 C 191.25 227.300781 187.074219 226.386719 185.066406 223.246094 L 131.695312 139.890625 C 129.683594 136.753906 130.601562 132.578125 133.738281 130.566406 L 217.09375 77.199219 C 220.234375 75.1875 224.410156 76.101562 226.417969 79.242188 Z M 226.417969 79.242188 "/></clipPath>
                <clipPath id={`clip21-${ids[20]}`}><path d="M 194 182 L 314 182 L 314 272 L 194 272 Z M 194 182 "/></clipPath>
                <clipPath id={`clip22-${ids[21]}`}><path d="M 301.703125 175.324219 L 320.707031 205.003906 L 206.390625 278.199219 L 187.390625 248.519531 Z M 301.703125 175.324219 "/></clipPath>
                <clipPath id={`clip23-${ids[22]}`}><path d="M 311.207031 190.164062 C 316.453125 198.359375 314.0625 209.257812 305.867188 214.507812 L 221.304688 268.652344 C 213.105469 273.898438 202.207031 271.507812 196.960938 263.3125 C 191.714844 255.117188 194.105469 244.21875 202.300781 238.972656 L 286.863281 184.828125 C 295.058594 179.578125 305.957031 181.96875 311.207031 190.164062 Z M 311.207031 190.164062 "/></clipPath>
                <clipPath id={`clip24-${ids[23]}`}><path d="M 97 31 L 218 31 L 218 121 L 97 121 Z M 97 31 "/></clipPath>
                <clipPath id={`clip25-${ids[24]}`}><path d="M 205.046875 24.363281 L 224.050781 54.042969 L 109.734375 127.238281 L 90.730469 97.558594 Z M 205.046875 24.363281 "/></clipPath>
                <clipPath id={`clip26-${ids[25]}`}><path d="M 214.546875 39.203125 C 219.796875 47.398438 217.40625 58.296875 209.210938 63.546875 L 124.644531 117.691406 C 116.449219 122.9375 105.550781 120.546875 100.304688 112.351562 C 95.058594 104.15625 97.445312 93.257812 105.644531 88.011719 L 190.207031 33.867188 C 198.402344 28.617188 209.300781 31.007812 214.546875 39.203125 Z M 214.546875 39.203125 "/></clipPath>
                <clipPath id={`clip27-${ids[26]}`}><path d="M 52 194 L 151 194 L 151 265 L 52 265 Z M 52 194 "/></clipPath>
                <clipPath id={`clip28-${ids[27]}`}><path d="M 52.507812 252.042969 L 142.609375 194.300781 L 150.902344 207.238281 L 60.796875 264.984375 Z M 52.507812 252.042969 "/></clipPath>
                <clipPath id={`clip29-${ids[28]}`}><path d="M 57.363281 14.132812 L 322.847656 14.132812 L 322.847656 360.628906 L 57.363281 360.628906 Z M 57.363281 14.132812 "/></clipPath>
                <clipPath id={`clip30-${ids[29]}`}><path d="M 322.847656 313.941406 L 322.847656 14.132812 L 57.375 14.132812 L 57.375 313.941406 L 190.109375 360.621094 Z M 322.847656 313.941406 "/></clipPath>
                <clipPath id={`clip31-${ids[30]}`}><path d="M 52.8125 9.140625 L 325.8125 9.140625 L 325.8125 366 L 52.8125 366 Z M 52.8125 9.140625 "/></clipPath>
                <clipPath id={`clip32-${ids[31]}`}><path d="M 325.8125 317.449219 L 325.8125 9.140625 L 52.8125 9.140625 L 52.8125 317.449219 L 189.3125 365.453125 Z M 325.8125 317.449219 "/></clipPath>
            </defs>
            
            <g id={ids[32]}>
                <g clipRule="nonzero" clipPath={`url(#clip1-${ids[0]})`}>
                    <g clipRule="nonzero" clipPath={`url(#clip2-${ids[1]})`}>
                        <path style={{ stroke: "none", fillRule: "nonzero", fill: backgroundColor, fillOpacity: 1 }} d="M 318.917969 19.265625 L 318.917969 355.617188 L 61.113281 355.617188 L 61.113281 19.265625 Z M 318.917969 19.265625 "/>
                    </g>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip3-${ids[2]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 84.125 269.503906 L 96.359375 269.503906 L 96.359375 323.167969 L 84.125 323.167969 Z M 84.125 269.503906 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip4-${ids[3]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 102.476562 254.941406 L 114.707031 254.941406 L 114.707031 327.101562 L 102.476562 327.101562 Z M 102.476562 254.941406 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip5-${ids[4]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 120.714844 243.808594 L 132.949219 243.808594 L 132.949219 332.691406 L 120.714844 332.691406 Z M 120.714844 243.808594 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip6-${ids[5]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 138.957031 231.683594 L 151.191406 231.683594 L 151.191406 341.355469 L 138.957031 341.355469 Z M 138.957031 231.683594 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip7-${ids[6]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 157.199219 218.691406 L 169.433594 218.691406 L 169.433594 346.855469 L 157.199219 346.855469 Z M 157.199219 218.691406 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip8-${ids[7]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 175.441406 238.035156 L 187.675781 238.035156 L 187.675781 354.875 L 175.441406 354.875 Z M 175.441406 238.035156 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip9-${ids[8]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 193.683594 281.058594 L 205.914062 281.058594 L 205.914062 353.074219 L 193.683594 353.074219 Z M 193.683594 281.058594 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip10-${ids[9]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 211.921875 291.023438 L 224.15625 291.023438 L 224.15625 346.835938 L 211.921875 346.835938 Z M 211.921875 291.023438 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip11-${ids[10]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 230.164062 277.578125 L 242.398438 277.578125 L 242.398438 338.601562 L 230.164062 338.601562 Z M 230.164062 277.578125 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip12-${ids[11]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 248.40625 263.597656 L 260.640625 263.597656 L 260.640625 332.695312 L 248.40625 332.695312 Z M 248.40625 263.597656 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip13-${ids[12]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 266.648438 254.941406 L 278.878906 254.941406 L 278.878906 327.101562 L 266.648438 327.101562 Z M 266.648438 254.941406 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip14-${ids[13]})`}>
                    <path style={{ stroke: "none", fillRule: "nonzero", fill: barsColor, fillOpacity: 1 }} d="M 284.886719 238.035156 L 297.121094 238.035156 L 297.121094 318.9375 L 284.886719 318.9375 Z M 284.886719 238.035156 "/>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip15-${ids[14]})`}>
                    <g clipRule="nonzero" clipPath={`url(#clip16-${ids[15]})`}>
                        <g clipRule="nonzero" clipPath={`url(#clip17-${ids[16]})`}>
                            <path style={{ stroke: "none", fillRule: "nonzero", fill: gavelColor, fillOpacity: 1 }} d="M 191.363281 139.527344 L 210.367188 169.207031 L 68.226562 260.214844 L 49.222656 230.535156 Z M 191.363281 139.527344 "/>
                        </g>
                    </g>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip18-${ids[17]})`}>
                    <g clipRule="nonzero" clipPath={`url(#clip19-${ids[18]})`}>
                        <g clipRule="nonzero" clipPath={`url(#clip20-${ids[19]})`}>
                            <path style={{ stroke: "none", fillRule: "nonzero", fill: gavelColor, fillOpacity: 1 }} d="M 222.777344 73.558594 L 283.429688 168.28125 L 188.703125 228.929688 L 128.054688 134.207031 Z M 222.777344 73.558594 "/>
                        </g>
                    </g>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip21-${ids[20]})`}>
                    <g clipRule="nonzero" clipPath={`url(#clip22-${ids[21]})`}>
                        <g clipRule="nonzero" clipPath={`url(#clip23-${ids[22]})`}>
                            <path style={{ stroke: "none", fillRule: "nonzero", fill: gavelColor, fillOpacity: 1 }} d="M 301.703125 175.324219 L 320.707031 205.003906 L 206.507812 278.125 L 187.503906 248.445312 Z M 301.703125 175.324219 "/>
                        </g>
                    </g>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip24-${ids[23]})`}>
                    <g clipRule="nonzero" clipPath={`url(#clip25-${ids[24]})`}>
                        <g clipRule="nonzero" clipPath={`url(#clip26-${ids[25]})`}>
                            <path style={{ stroke: "none", fillRule: "nonzero", fill: gavelColor, fillOpacity: 1 }} d="M 205.046875 24.363281 L 224.050781 54.042969 L 109.851562 127.164062 L 90.847656 97.484375 Z M 205.046875 24.363281 "/>
                        </g>
                    </g>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip27-${ids[26]})`}>
                    <g clipRule="nonzero" clipPath={`url(#clip28-${ids[27]})`}>
                        <path style={{ stroke: "none", fillRule: "nonzero", fill: gavelColor, fillOpacity: 1 }} d="M 52.507812 252.042969 L 142.621094 194.292969 L 150.914062 207.230469 L 60.796875 264.984375 Z M 52.507812 252.042969 "/>
                    </g>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip29-${ids[28]})`}>
                    <g clipRule="nonzero" clipPath={`url(#clip30-${ids[29]})`}>
                        <path style={{ fill: "none", strokeWidth: 22, strokeLinecap: "butt", strokeLinejoin: "miter", stroke: insideBorderColor, strokeOpacity: 1, strokeMiterlimit: 4 }} d="M 400.014285 -0.000165646 L -0.000930672 -0.000165646 L -0.000930672 354.202829 L 400.014285 354.202829 L 462.295973 177.103938 Z M 400.014285 -0.000165646 " transform="matrix(0,0.749493,-0.749493,0,322.847532,14.13351)"/>
                    </g>
                </g>
                <g clipRule="nonzero" clipPath={`url(#clip31-${ids[30]})`}>
                    <g clipRule="nonzero" clipPath={`url(#clip32-${ids[31]})`}>
                        <path style={{ fill: "none", strokeWidth: 16, strokeLinecap: "butt", strokeLinejoin: "miter", stroke: borderColor, strokeOpacity: 1, strokeMiterlimit: 4 }} d="M 411.539323 0.000303145 L 0.00235687 0.000303145 L 0.00235687 364.406596 L 411.539323 364.406596 L 475.615974 182.20345 Z M 411.539323 0.000303145 " transform="matrix(0,0.749164,-0.749164,0,325.812727,9.138859)"/>
                    </g>
                </g>
            </g>            
        </svg>    
    )
}
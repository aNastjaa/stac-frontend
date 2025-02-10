import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DotLoader = () => {
    return (_jsxs("div", { className: "loading-container", children: [_jsx("div", { className: "dot-loader", children: _jsxs("div", { className: "container", children: [_jsx("div", { className: "dot" }), _jsx("div", { className: "dot" }), _jsx("div", { className: "dot" }), _jsx("div", { className: "dot" }), _jsx("div", { className: "dot" }), _jsx("div", { className: "dot" })] }) }), _jsx("h1", { className: "loading-text", children: "loading..." }), _jsx("style", { children: `
          .loading-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background-color: rgba(255, 255, 255, 0.8); /* Optional: add a semi-transparent background */
          }

          .dot-loader {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .container {
            --uib-size: 40px;
            --uib-color: black;
            --uib-speed: 1.5s;
            --dot-size: calc(var(--uib-size) * 0.17);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: var(--uib-size);
            width: var(--uib-size);
            animation: smoothRotate calc(var(--uib-speed) * 1.8) linear infinite;
          }

          .dot {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            height: 100%;
            width: 100%;
            animation: rotate var(--uib-speed) ease-in-out infinite;
          }

          .dot::before {
            content: '';
            height: var(--dot-size);
            width: var(--dot-size);
            border-radius: 50%;
            background-color: var(--uib-color);
            transition: background-color 0.3s ease;
          }

          .dot:nth-child(2),
          .dot:nth-child(2)::before {
            animation-delay: calc(var(--uib-speed) * -0.835 * 0.5);
          }

          .dot:nth-child(3),
          .dot:nth-child(3)::before {
            animation-delay: calc(var(--uib-speed) * -0.668 * 0.5);
          }

          .dot:nth-child(4),
          .dot:nth-child(4)::before {
            animation-delay: calc(var(--uib-speed) * -0.501 * 0.5);
          }

          .dot:nth-child(5),
          .dot:nth-child(5)::before {
            animation-delay: calc(var(--uib-speed) * -0.334 * 0.5);
          }

          .dot:nth-child(6),
          .dot:nth-child(6)::before {
            animation-delay: calc(var(--uib-speed) * -0.167 * 0.5);
          }

          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            65%, 100% {
              transform: rotate(360deg);
            }
          }

          @keyframes smoothRotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          .loading-text {
            font-family: 'Sedgwick Ave Display', sans-serif;
            font-size: 40px;
            color: #131313;
            margin-top: 20px; /* Space between the dots loader and the text */
            text-align: center;
          }
        ` })] }));
};
export default DotLoader;

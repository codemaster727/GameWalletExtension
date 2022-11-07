import { createGlobalStyle } from 'styled-components';
import 'normalize.css/normalize.css';

interface ITheme {
  theme: {
    dark: string;
  };
}

export default createGlobalStyle<ITheme>`
  :root {
  /* UI Colors */
  --primary-color: #fff;
  --secondary-color: #000;

  --background-color: #000;
  }

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
    /* BETTER FONT SMOOTHING - https://gist.github.com/hsleonis/55712b0eafc9b25f1944 */
		font-variant-ligatures: none;
		-webkit-font-variant-ligatures: none;
		text-rendering: optimizeLegibility;
		-moz-osx-font-smoothing: grayscale;
		font-smooth: antialiased;
		-webkit-font-smoothing: antialiased;
		text-shadow: rgba(0, 0, 0, 0.01) 0 0 1px;
  }

  body {
		position: relative;
    background: #17181b;
    color: var(--primary-color);
		line-height: 1.5;
    height: 100vh;
    margin: auto;
    overflow: initial;
		width: 330px;
		height: 550px;
		border: 1px dash white;
  }

  body, input, textarea, button {
    font: 16px 'Montserrat', sans-serif;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-family: 'Lato', sans-serif;
    line-height: 1.25;
		margin: 16px 0;
		text-transform: capitalize;
  }

  	/* Common base styles for the site */
	figure, img, svg, video {
		max-width: 100%;
	}

	figure {
		width: auto !important;
	}

	video {
		display: block;
		width: 100%;
	}

	h1, .h1 {
		margin: 24px 0;
		font-size: 3.20px;
		font-weight: 700;
		line-height: 1.1;
	}

	h2,	.h2 {
		font-size: 30px;
	}

	h3,	.h3 {
		font-size: 2.40px;
	}

	h4,	.h4 {
		font-size: 20px;
	}

	h5,	.h5 {
		font-size: 18px;
	}

	h6,	.h6 {
		font-size: 16px;
	}

  button, a {
    font-size: 15px;
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* Accessibly remove animations: https://gist.githubusercontent.com/bellangerq/6cdfe6e3701b4048c72546960c7c9f66/raw/dc5036697d0da57eff8e0f659106b319102e72a0/a11y-disable-animations.css */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.001ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.001ms !important;
		}
	}

  /* https://www.scottohara.me/blog/2017/04/14/inclusively-hidden.html */
	.hide:not(:focus):not(:active),
	.hidden:not(:focus):not(:active) {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
  }

  html {
    @media (max-width: 1080px) {
      font-size: 60%;
    }
    @media (max-width: 980px) {
      font-size: 48%;
    }
  }

	.pagination {
    // bottom: -10px;
    position: absolute !important;
    bottom: -20px;
    left: 0;
    justify-content: center;
	}

	.hl-swiper-prev {
		position: absolute !important;
    top: 50%;
		left: 0;
		transform: translateY(-50%); 
    z-index: $z-index-overlay-body + 1;
	}

	.hl-swiper-next {
		position: absolute !important;
    top: 50%;
		right: 0;
		transform: translateY(-50%); 
    z-index: $z-index-overlay-body + 1;
	}

	.swiper-button-disabled {
		background: #262628 !important;
	}

	.no_scroll_bar::-webkit-scrollbar {
		display: none;
	}

	.menuitem-currency {
		width: calc(140px - 5px) !important;
		min-height: 25px !important;
		line-height: 0;
		&:hover{
			background-color: #363739 !important;
		}
	}

	.Mui-selected {
		border: 1px solid #0abab5 !important;
		background-color: #17181b !important;
		color: #0abab5 !important;
	}

	.menuitem-pageunit {
		width: calc(80px - 5px) !important;
		&:hover{
			background-color: #363739 !important;
		}
	}

	.MuiSelect-select svg path {
		fill: white !important;
	}

	.MuiPaper-root {
		background-color: #17181b !important;
	}

	.MuiPaper-root::-webkit-scrollbar {
		width: 4px;
		background-color: #17181b;    /* color of the scroll thumb */
	}
	
	.MuiPaper-root::-webkit-scrollbar-thumb {
		width: 2px;
		background: black;        /* color of the tracking area */
		border-radius: 20px;       /* roundness of the scroll thumb */
	}

	.MuiPaper-root fieldset {
		border: 1px solid #666666 !important;
		// width: 140px !important;
	}

	.css-oianzg-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root.Mui-focused .MuiOutlinedInput-notchedOutline {
		border-width: 1px !important;
		border-color: #666666 !important;
	}

	fieldset {
		display: none;
	}

	.css-d7py89-MuiTable-root .css-e5a0pp-MuiTableBody-root {
		border-radius: 20px !important;
		padding: 40px !important;
	}

	.currency_select {
		.MuiSvgIcon-root {
			path {
				color: white !important;
			}
		}
	}

	.pagination_select {
		.MuiSvgIcon-root {
			path {
				color: #7F7F7F !important;
			}
		}
	}

	.base-box {
		padding: 0;
		background-color: #202328;
	}

	.bottom-box {
		position: absolute;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		text-align: center;
		height: 60px;
		border-top: 1px solid grey;
	}

	.MuiButtonBase-root {
		text-transform: unset !important;
	}

	.balance-btn {
		width: 80px;
    height: 30px;
    background: inherit;
    background-color: rgba(40, 43, 49, 1);
    border: none;
    border-radius: 15px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-size: 14px;
	}
`;

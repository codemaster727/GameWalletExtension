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
	--brand-colors-white-white000: #ffffff;
  --brand-colors-white-white010: #fcfcfc;
  --brand-colors-black-black000: #000000;
  --brand-colors-grey-grey030: #fafbfc;
  --brand-colors-grey-grey040: #f2f4f6;
  --brand-colors-grey-grey100: #d6d9dc;
  --brand-colors-grey-grey200: #bbc0c5;
  --brand-colors-grey-grey300: #9fa6ae;
  --brand-colors-grey-grey400: #848c96;
  --brand-colors-grey-grey500: #6a737d;
  --brand-colors-grey-grey600: #535a61;
  --brand-colors-grey-grey700: #3b4046;
  --brand-colors-grey-grey750: #2e3339;
  --brand-colors-grey-grey800: #24272a;
  --brand-colors-grey-grey900: #141618;
  --brand-colors-blue-blue000: #eaf6ff;
  --brand-colors-blue-blue100: #a7d9fe;
  --brand-colors-blue-blue200: #75c4fd;
  --brand-colors-blue-blue300: #43aefc;
  --brand-colors-blue-blue400: #1098fc;
  --brand-colors-blue-blue500: #037dd6;
  --brand-colors-blue-blue600: #0260a4;
  --brand-colors-blue-blue700: #024272;
  --brand-colors-blue-blue800: #01253f;
  --brand-colors-blue-blue900: #00080d;
  --brand-colors-orange-orange000: #fef5ef;
  --brand-colors-orange-orange100: #fde2cf;
  --brand-colors-orange-orange200: #fbc49d;
  --brand-colors-orange-orange300: #faa66c;
  --brand-colors-orange-orange400: #f8883b;
  --brand-colors-orange-orange500: #f66a0a;
  --brand-colors-orange-orange600: #c65507;
  --brand-colors-orange-orange700: #954005;
  --brand-colors-orange-orange800: #632b04;
  --brand-colors-orange-orange900: #321602;
  --brand-colors-green-green000: #f3fcf5;
  --brand-colors-green-green100: #d6ffdf;
  --brand-colors-green-green200: #afecbd;
  --brand-colors-green-green300: #86e29b;
  --brand-colors-green-green400: #5dd879;
  --brand-colors-green-green500: #28a745;
  --brand-colors-green-green600: #1e7e34;
  --brand-colors-green-green700: #145523;
  --brand-colors-green-green800: #0a2c12;
  --brand-colors-green-green900: #041007;
  --brand-colors-red-red000: #fcf2f3;
  --brand-colors-red-red100: #f7d5d8;
  --brand-colors-red-red200: #f1b9be;
  --brand-colors-red-red300: #e88f97;
  --brand-colors-red-red400: #e06470;
  --brand-colors-red-red500: #d73a49;
  --brand-colors-red-red600: #b92534;
  --brand-colors-red-red700: #8e1d28;
  --brand-colors-red-red800: #64141c;
  --brand-colors-red-red900: #3a0c10;
  --brand-colors-purple-purple500: #8b45b6;
  --brand-colors-violet-violet300: #CFB5F0;
  --brand-colors-yellow-yellow000: #fffdf8;
  --brand-colors-yellow-yellow100: #fefcde;
  --brand-colors-yellow-yellow200: #fff2c5;
  --brand-colors-yellow-yellow300: #ffeaa3;
  --brand-colors-yellow-yellow400: #ffdf70;
  --brand-colors-yellow-yellow500: #ffd33d;
  --brand-colors-yellow-yellow600: #ffc70a;
  /* typography */
  /* font family */
  --font-family-euclid-circular-b: "Euclid Circular B", sans-serif;
  --font-family-roboto: "Roboto", sans-serif;
  --font-family-sans: "Euclid Circular B", "Roboto", sans-serif;
  /* font sizes */
  --font-size-base: 16px;
  --font-size-1: 0.625rem;
  --font-size-2: 0.75rem;
  --font-size-3: 0.875rem;
  --font-size-4: 1rem;
  --font-size-5: 1.125rem;
  --font-size-6: 1.5rem;
  --font-size-7: 2rem;
  --font-size-8: 3rem;
  /* line heights */
  --line-height-1: 1rem;
  --line-height-2: 1.25rem;
  --line-height-3: 1.375rem;
  --line-height-4: 1.5rem;
  --line-height-5: 2rem;
  --line-height-6: 2.5rem;
  --line-height-7: 3.5rem;
  /* font weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  /* letter spacing */
  --letter-spacing-0: 0;
  --letter-spacing-1: 2.5%;
  /* typography scale small screen */
  --typography-s-display-md-font-family: var(--font-family-sans);
  --typography-s-display-md-font-size: var(--font-size-7);
  --typography-s-display-md-line-height: var(--line-height-6);
  --typography-s-display-md-font-weight: var(--font-weight-bold);
  --typography-s-display-md-letter-spacing: var(--letter-spacing-0);
  --typography-s-heading-lg-font-family: var(--font-family-sans);
  --typography-s-heading-lg-font-size: var(--font-size-6);
  --typography-s-heading-lg-line-height: var(--line-height-5);
  --typography-s-heading-lg-font-weight: var(--font-weight-bold);
  --typography-s-heading-lg-letter-spacing: var(--letter-spacing-0);
  --typography-s-heading-md-font-family: var(--font-family-sans);
  --typography-s-heading-md-font-size: var(--font-size-5);
  --typography-s-heading-md-line-height: var(--line-height-4);
  --typography-s-heading-md-font-weight: var(--font-weight-bold);
  --typography-s-heading-md-letter-spacing: var(--letter-spacing-0);
  --typography-s-heading-sm-font-family: var(--font-family-sans);
  --typography-s-heading-sm-font-size: var(--font-size-4);
  --typography-s-heading-sm-line-height: var(--line-height-4);
  --typography-s-heading-sm-font-weight: var(--font-weight-bold);
  --typography-s-heading-sm-letter-spacing: var(--letter-spacing-0);
  /**
   * @deprecated [#1] since version 1.9 [#2].
   * [#3] Will be deleted in version 2.0.
   */
  --typography-s-heading-sm-regular-font-family: var(--font-family-sans);
  --typography-s-heading-sm-regular-font-size: var(--font-size-4);
  --typography-s-heading-sm-regular-line-height: var(--line-height-4);
  --typography-s-heading-sm-regular-font-weight: var(--font-weight-regular);
  --typography-s-heading-sm-regular-letter-spacing: var(--letter-spacing-0);
  --typography-s-body-lg-medium-font-family: var(--font-family-sans);
  --typography-s-body-lg-medium-font-size: var(--font-size-4);
  --typography-s-body-lg-medium-line-height: var(--line-height-4);
  --typography-s-body-lg-medium-font-weight: var(--font-weight-medium);
  --typography-s-body-lg-medium-letter-spacing: var(--letter-spacing-0);
  --typography-s-body-lg-regular-font-family: var(--font-family-sans);
  --typography-s-body-lg-regular-font-size: var(--font-size-4);
  --typography-s-body-lg-regular-line-height: var(--line-height-4);
  --typography-s-body-lg-regular-font-weight: var(--font-weight-medium);
  --typography-s-body-lg-regular-letter-spacing: var(--letter-spacing-0);
  --typography-s-body-md-bold-font-family: var(--font-family-sans);
  --typography-s-body-md-bold-font-size: var(--font-size-3);
  --typography-s-body-md-bold-line-height: var(--line-height-3);
  --typography-s-body-md-bold-font-weight: var(--font-weight-bold);
  --typography-s-body-md-bold-letter-spacing: var(--letter-spacing-0);
  --typography-s-body-md-font-family: var(--font-family-sans);
  --typography-s-body-md-font-size: var(--font-size-3);
  --typography-s-body-md-line-height: var(--line-height-3);
  --typography-s-body-md-font-weight: var(--font-weight-regular);
  --typography-s-body-md-letter-spacing: var(--letter-spacing-0);
  --typography-s-body-sm-bold-font-family: var(--font-family-sans);
  --typography-s-body-sm-bold-font-size: var(--font-size-2);
  --typography-s-body-sm-bold-line-height: var(--line-height-2);
  --typography-s-body-sm-bold-font-weight: var(--font-weight-bold);
  --typography-s-body-sm-bold-letter-spacing: var(--letter-spacing-0);
  --typography-s-body-sm-font-family: var(--font-family-sans);
  --typography-s-body-sm-font-size: var(--font-size-2);
  --typography-s-body-sm-line-height: var(--line-height-2);
  --typography-s-body-sm-font-weight: var(--font-weight-regular);
  --typography-s-body-sm-letter-spacing: var(--letter-spacing-0);
  --typography-s-body-xs-font-family: var(--font-family-sans);
  --typography-s-body-xs-font-size: var(--font-size-1);
  --typography-s-body-xs-line-height: var(--line-height-1);
  --typography-s-body-xs-font-weight: var(--font-weight-regular);
  --typography-s-body-xs-letter-spacing: var(--letter-spacing-0);
  /* typography scale large screen */
  --typography-l-display-md-font-family: var(--font-family-sans);
  --typography-l-display-md-font-size: var(--font-size-8);
  --typography-l-display-md-line-height: var(--line-height-7);
  --typography-l-display-md-font-weight: var(--font-weight-medium);
  --typography-l-display-md-letter-spacing: var(--letter-spacing-0);
  --typography-l-heading-lg-font-family: var(--font-family-sans);
  --typography-l-heading-lg-font-size: var(--font-size-7);
  --typography-l-heading-lg-line-height: var(--line-height-6);
  --typography-l-heading-lg-font-weight: var(--font-weight-bold);
  --typography-l-heading-lg-letter-spacing: var(--letter-spacing-0);
  --typography-l-heading-md-font-family: var(--font-family-sans);
  --typography-l-heading-md-font-size: var(--font-size-6);
  --typography-l-heading-md-line-height: var(--line-height-5);
  --typography-l-heading-md-font-weight: var(--font-weight-bold);
  --typography-l-heading-md-letter-spacing: var(--letter-spacing-0);
  --typography-l-heading-sm-font-family: var(--font-family-sans);
  --typography-l-heading-sm-font-size: var(--font-size-5);
  --typography-l-heading-sm-line-height: var(--line-height-4);
  --typography-l-heading-sm-font-weight: var(--font-weight-bold);
  --typography-l-heading-sm-letter-spacing: var(--letter-spacing-0);
  /**
   * @deprecated [#1] since version 1.9 [#2].
   * [#3] Will be deleted in version 2.0.
   */
  --typography-l-heading-sm-regular-font-family: var(--font-family-sans);
  --typography-l-heading-sm-regular-font-size: var(--font-size-5);
  --typography-l-heading-sm-regular-line-height: var(--line-height-4);
  --typography-l-heading-sm-regular-font-weight: var(--font-weight-regular);
  --typography-l-heading-sm-regular-letter-spacing: var(--letter-spacing-0);
  --typography-l-body-lg-medium-font-family: var(--font-family-sans);
  --typography-l-body-lg-medium-font-size: var(--font-size-5);
  --typography-l-body-lg-medium-line-height: var(--line-height-4);
  --typography-l-body-lg-medium-font-weight: var(--font-weight-medium);
  --typography-l-body-lg-medium-letter-spacing: var(--letter-spacing-0);
  --typography-l-body-md-bold-font-family: var(--font-family-sans);
  --typography-l-body-md-bold-font-size: var(--font-size-4);
  --typography-l-body-md-bold-line-height: var(--line-height-4);
  --typography-l-body-md-bold-font-weight: var(--font-weight-bold);
  --typography-l-body-md-bold-letter-spacing: var(--letter-spacing-0);
  --typography-l-body-md-font-family: var(--font-family-sans);
  --typography-l-body-md-font-size: var(--font-size-4);
  --typography-l-body-md-line-height: var(--line-height-4);
  --typography-l-body-md-font-weight: var(--font-weight-regular);
  --typography-l-body-md-letter-spacing: var(--letter-spacing-0);
  --typography-l-body-sm-bold-font-family: var(--font-family-sans);
  --typography-l-body-sm-bold-font-size: var(--font-size-3);
  --typography-l-body-sm-bold-line-height: var(--line-height-3);
  --typography-l-body-sm-bold-font-weight: var(--font-weight-bold);
  --typography-l-body-sm-bold-letter-spacing: var(--letter-spacing-0);
  --typography-l-body-sm-font-family: var(--font-family-sans);
  --typography-l-body-sm-font-size: var(--font-size-3);
  --typography-l-body-sm-line-height: var(--line-height-3);
  --typography-l-body-sm-font-weight: var(--font-weight-regular);
  --typography-l-body-sm-letter-spacing: var(--letter-spacing-0);
  --typography-l-body-xs-font-family: var(--font-family-sans);
  --typography-l-body-xs-font-size: var(--font-size-2);
  --typography-l-body-xs-line-height: var(--line-height-2);
  --typography-l-body-xs-font-weight: var(--font-weight-regular);
  --typography-l-body-xs-letter-spacing: var(--letter-spacing-0);
  /* shadow */
  --shadow-size-xs: 0 2px 4px 0;
  --shadow-size-sm: 0 2px 8px 0;
  --shadow-size-md: 0 2px 16px 0;
  --shadow-size-lg: 0 2px 40px 0;
	
	--color-background-default: var(--brand-colors-grey-grey800);
  --color-background-default-hover: var(--brand-colors-grey-grey700);
  --color-background-default-pressed: var(--brand-colors-grey-grey700);
  --color-background-alternative: var(--brand-colors-grey-grey900);
  --color-background-alternative-hover: var(--brand-colors-grey-grey750);
  --color-background-alternative-pressed: var(--brand-colors-grey-grey750);
  --color-text-default: var(--brand-colors-white-white000);
  --color-text-alternative: var(--brand-colors-grey-grey100);
  --color-text-muted: var(--brand-colors-grey-grey400);
  --color-icon-default: var(--brand-colors-white-white000);
  --color-icon-alternative: var(--brand-colors-grey-grey200);
  --color-icon-muted: var(--brand-colors-grey-grey400);
  --color-border-default: var(--brand-colors-grey-grey400);
  --color-border-muted: var(--brand-colors-grey-grey700);
  --color-overlay-default: #00000099;
  --color-overlay-alternative: #000000cc;
  --color-shadow-default: #00000080;
  --color-overlay-inverse: var(--brand-colors-white-white010);
  --color-primary-default: var(--brand-colors-blue-blue400);
  --color-primary-alternative: var(--brand-colors-blue-blue300);
  --color-primary-muted: #1098fc26;
  --color-primary-inverse: var(--brand-colors-white-white010);
  --color-primary-disabled: #1098fc80;
  --color-primary-shadow: #037dd633;
  --color-secondary-default: var(--brand-colors-orange-orange400);
  --color-secondary-alternative: var(--brand-colors-orange-orange300);
  --color-secondary-muted: #f8883b26;
  --color-secondary-inverse: var(--brand-colors-white-white010);
  --color-secondary-disabled: #f8883b80;
  --color-error-default: var(--brand-colors-red-red500);
  --color-error-alternative: var(--brand-colors-red-red400);
  --color-error-muted: #d73a4926;
  --color-error-inverse: var(--brand-colors-white-white010);
  --color-error-disabled: #d73a4980;
  --color-error-shadow: #d73a4966;
  --color-warning-default: var(--brand-colors-yellow-yellow500);
  --color-warning-alternative: var(--brand-colors-yellow-yellow400);
  --color-warning-muted: #ffd33d26;
  --color-warning-inverse: var(--brand-colors-grey-grey900);
  --color-warning-disabled: #ffd33d80;
  --color-success-default: var(--brand-colors-green-green500);
  --color-success-alternative: var(--brand-colors-green-green400);
  --color-success-muted: #28a74526;
  --color-success-inverse: var(--brand-colors-white-white010);
  --color-success-disabled: #28a74580;
  --color-info-default: var(--brand-colors-blue-blue400);
  --color-info-alternative: var(--brand-colors-blue-blue300);
  --color-info-muted: #1098fc26;
  --color-info-inverse: var(--brand-colors-white-white010);
  --color-info-disabled: #037dd680;
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
		width: 390px;
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
		font-size: 32px;
		font-weight: 700;
		line-height: 1.1;
	}

	h2,	.h2 {
		font-size: 30px;
	}

	h3,	.h3 {
		font-size: 24px;
	}

	h4,	.h4 {
		font-size: 20px;
	}

	h5,	.h5 {
		font-size: 16px !important;
	}

	h6,	.h6 {
		font-size: 14px !important;
	}

  button, a {
    font-size: 16px;
    cursor: pointer;
		line-height: normal !important;
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
		width: calc(120px - 5px) !important;
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
		// width: 120px !important;
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
		display: flex;
		flex-direction: column;
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
		gap: 0px;
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

	.MuiSelect-select.MuiInputBase-input {
		padding: 5px 14px  !important;
	}

	.balance-btn {
		width: 80px !important;
    height: 30px !important;
    border-radius: 15px !important;
    -moz-box-shadow: none !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
    font-size: 14px !important;
	}

	.react-switch {
		border: 1px solid white;
		vertical-align: middle !important;
		border-radius: 20px !important;
		align-items: center !important;
		position: absolute !important;
		top: 50%;
    left: -10px;
    transform: translateY(-50%);
	}
`;

import React from 'react';
import { Button } from '@mui/material';
import { style_btn } from '../styles';
import LeftArrowImage from '../../assets/utils/line-angle-left-icon.svg';
import RightArrowImage from '../../assets/utils/line-angle-right-icon.svg';

interface VoidFn {
  (): void;
}

interface ButtonProps {
  handleClick: VoidFn;
}

export const PrevButtonForSwiper = () => (
  <Button
    className="hl-swiper-prev"
    style={{
      ...style_btn,
      width: '40px',
      height: '50px',
      minWidth: '40px',
      margin: '0',
      padding: '0',
      backgroundColor: '#26282d',
    }}
  >
    <img src={LeftArrowImage} alt="LeftArrowImage" width={10} />
  </Button>
);

export const NextButtonForSwiper = () => (
  <Button
    className="hl-swiper-next"
    style={{
      ...style_btn,
      width: '40px',
      height: '50px',
      minWidth: '40px',
      margin: '0',
      padding: '0',
      backgroundColor: '#26282d',
    }}
  >
    <img src={RightArrowImage} alt="RightArrowImage" width={10} />
  </Button>
);

export const PrevButton = ({ handleClick }: ButtonProps) => (
  <Button
    style={{
      ...style_btn,
      margin: '0',
      width: 'fit-content',
      height: 'fit-content',
      padding: '0',
      backgroundColor: 'transparent',
    }}
    onClick={handleClick}
  >
    <img src={LeftArrowImage} alt="LeftArrowImage" width={10} />
  </Button>
);

export const NextButton = ({ handleClick }: ButtonProps) => (
  <Button
    style={{
      ...style_btn,
      margin: '0',
      width: 'fit-content',
      height: 'fit-content',
      padding: '0',
      backgroundColor: 'transparent',
    }}
    onClick={handleClick}
  >
    <img src={RightArrowImage} alt="RightArrowImage" width={10} />
  </Button>
);

import React from 'react';

type ScrollBoxProps = {
  height?: number;
  children: boolean | React.ReactElement | (React.ReactElement | boolean)[];
};
const ScrollBox = ({ height = 420, children }: ScrollBoxProps) => {
  return (
    <div
      className='no_scroll_bar'
      style={{
        padding: '0',
        height,
        overflow: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollBox;

import React from 'react';

const Icon = (icon: any, width?: number) =>
  icon ? (
    <img
      alt="icon"
      src={icon}
      width={`${width ?? 30}px`}
      style={{ borderRadius: '20px', minWidth: `${width ?? 30}px` }}
    />
  ) : null;

export default Icon;

export const DownIcon = (icon: any, width?: number) =>
  icon ? (
    <img
      alt="icon"
      src={icon}
      width={`${width ?? 30}px`}
      style={{
        borderRadius: '20px',
        minWidth: `${width ?? 30}px`,
        position: 'absolute',
        right: '1rem',
        cursor: 'pointer',
      }}
    />
  ) : null;

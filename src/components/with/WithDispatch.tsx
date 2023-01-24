import React from 'react';
import { useDispatch } from 'react-redux';

export function withDispatch(Component: any) {
  return (props: any) => <Component {...props} dispatch={useDispatch()} />;
}

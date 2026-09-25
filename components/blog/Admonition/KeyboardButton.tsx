'use client';

import React from 'react';

// Keyboard button component
export const KeyboardButton = ({ children } : { children: React.ReactNode }) => {
  return (
    <span className="inline-flex items-center rounded-md bg-gray-900 px-2 py-1 text-sm font-medium text-gray-200 shadow-sm ring-1 ring-inset ring-gray-600">
      {children}
    </span>
  );
};

// Map of key symbols
const keySymbols: { [key: string]: string } = {
  cmd: 'Cmd ⌘',
  ctrl: 'Ctrl ⌃',
  opt: 'Opt ⌥',
  shift: 'Shift ⇧',
  enter: 'Enter ↵',
  left: '←',
  right: '→',
  up: '↑',
  down: '↓',
  tab: 'Tab ⇥',
  space: 'Space ␣',
  delete: 'Del ⌫',
  esc: 'Esc ⎋',
};

// Component to render keyboard button with symbol
export const KeyboardButtonWithSymbol = ({ keyName } : { keyName: string }) => {
  const symbol = keySymbols[keyName] || keyName;
  const display = symbol === keyName ? keyName : symbol;
  return <KeyboardButton>{display}</KeyboardButton>;
};

export default KeyboardButtonWithSymbol;

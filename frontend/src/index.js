import React from 'react';
import { createRoot } from 'react-dom/client';
import RouterWrapper from './RouterWrapper';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<RouterWrapper />);

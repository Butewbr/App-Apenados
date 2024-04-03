/**
 * @format
 */

import React from 'react';
import App from '../src/App';
import '../src/index.css';

import '@testing-library/jest-dom';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent, screen, cleanup} from '@testing-library/react';

beforeEach(cleanup);

describe('Web Admin Test', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
});

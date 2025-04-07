import '@testing-library/jest-dom';

import { message } from 'antd';

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
    Modal: ({ children, visible, onOk, onCancel, ...props }) => (
      visible ? (
        <div data-testid="mock-modal" {...props}>
          {children}
          <button onClick={onOk}>OK</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      ) : null
    ),
  };
});

jest.spyOn(console, 'error').mockImplementation(() => {});
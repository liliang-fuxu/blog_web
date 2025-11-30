import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = '加载中...' }) => {
  return (
    <div className="loading-spinner">
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
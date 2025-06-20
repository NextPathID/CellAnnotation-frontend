// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

function ScoreParameters({ scoreParams, onScoreParamsChange }) {
  const handleChange = (param, value) => {
    onScoreParamsChange({
      ...scoreParams,
      [param]: parseFloat(value)
    });
  };

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Score Parameters</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alpha
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={scoreParams.alpha}
            onChange={(e) => handleChange('alpha', e.target.value)}
            className="w-full"
          />
          <span className="text-sm text-gray-900">{scoreParams.alpha}</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Beta
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={scoreParams.beta}
            onChange={(e) => handleChange('beta', e.target.value)}
            className="w-full"
          />
          <span className="text-sm text-gray-900">{scoreParams.beta}</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gamma
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={scoreParams.gamma}
            onChange={(e) => handleChange('gamma', e.target.value)}
            className="w-full"
          />
          <span className="text-sm text-gray-900">{scoreParams.gamma}</span>
        </div>
      </div>
    </div>
  );
}

// ✅ Add PropTypes validation
ScoreParameters.propTypes = {
  scoreParams: PropTypes.shape({
    alpha: PropTypes.number.isRequired,
    beta: PropTypes.number.isRequired,
    gamma: PropTypes.number.isRequired,
  }).isRequired,
  onScoreParamsChange: PropTypes.func.isRequired,
};

export default ScoreParameters;

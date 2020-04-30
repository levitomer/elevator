import React from 'react';
import PropTypes from 'prop-types';

export default function Indicator({ floor, currentFloor, nextTargetFloor }) {
    return (
        <div
            className={`floor-indicator ${
                currentFloor === floor ? 'current-floor ' : ''
            }
${
    nextTargetFloor === currentFloor && nextTargetFloor === floor
        ? 'target-floor '
        : ''
}`}
        >
            {floor}
        </div>
    );
}

Indicator.propTypes = {
    currentFloor: PropTypes.number,
    nextTargetFloor: PropTypes.number,
    floor: PropTypes.number,
};

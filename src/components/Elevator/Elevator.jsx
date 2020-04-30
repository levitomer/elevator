import React from 'react';
import PropTypes from 'prop-types';
import { useCallFloor } from './hooks';

const floors = [0, 1, 2, 3, 4, 5, 6].reverse();

export default function Elevator({ elevator, stops, currentFloor }) {
    const handleCallFloor = (floor) => useCallFloor(elevator, floor);
    return floors.map((floor) => {
        const btnInsideStyle =
            stops[floor].stop === true && currentFloor != floor
                ? { borderColor: '#00e600' }
                : {};

        return (
            <button
                className="btn"
                key={floor}
                style={btnInsideStyle}
                onClick={handleCallFloor(floor)}
            >
                {floor}
            </button>
        );
    });
}

Elevator.propTypes = {
    elevator: PropTypes.string,
    currentFloor: PropTypes.number,
    stops: PropTypes.array,
};

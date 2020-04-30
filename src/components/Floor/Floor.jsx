import React from 'react';
import PropTypes from 'prop-types';
import { useCallElevator } from './hooks';
import Doors from './Doors/Doors';
import Indicator from './Indicator/Indicator';
import { assignElevator } from 'utils';

export default function Floor({
    floor,
    elevators,
    stops,
    currentFloor,
    doors,
    nextTargetFloor,
}) {
    const floorBtn = (floor, direction) =>
        stops[floor].stop === direction
            ? { borderColor: '#f03434', backgroundColor: '#f03434' }
            : {};

    const handleCallElevator = (direction) => {
        const elevator = assignElevator(elevators, direction, floor);
        return useCallElevator(elevator, floor, direction);
    };

    return (
        <div className="floor">
            <Doors currentFloor={currentFloor} floor={floor} doors={doors} />
            <Indicator
                floor={floor}
                currentFloor={currentFloor}
                nextTargetFloor={nextTargetFloor}
            />
            <div className="buttons">
                <button
                    className="btn"
                    style={floorBtn(floor, 'UP')}
                    onClick={handleCallElevator('UP')}
                >
                    UP
                </button>
                <button
                    className="btn"
                    style={floorBtn(floor, 'DOWN')}
                    onClick={handleCallElevator('DOWN')}
                >
                    DOWN
                </button>
            </div>
        </div>
    );
}

Floor.propTypes = {
    elevators: PropTypes.object,
    currentFloor: PropTypes.number,
    stops: PropTypes.array,
    floor: PropTypes.number,
    doors: PropTypes.string,
    nextTargetFloor: PropTypes.number,
};

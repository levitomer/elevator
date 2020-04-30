import React from 'react';
import PropTypes from 'prop-types';
import Floor from './Floor';
import { useSelector } from 'react-redux';

const floors = [0, 1, 2, 3, 4, 5, 6].reverse();

export default function FloorContainer({ elevator }) {
    const stops = useSelector((state) => state[elevator].stops);
    const currentFloor = useSelector((state) => state[elevator].currentFloor);
    const doors = useSelector((state) => state[elevator].doors);
    const nextTargetFloor = useSelector(
        (state) => state[elevator].nextTargetFloor
    );
    const elevators = useSelector((state) => state);

    return (
        <div className="floors">
            {floors.map((floor) => (
                <Floor
                    elevators={elevators}
                    key={floor}
                    floor={floor}
                    stops={stops}
                    currentFloor={currentFloor}
                    doors={doors}
                    nextTargetFloor={nextTargetFloor}
                />
            ))}
        </div>
    );
}

FloorContainer.propTypes = {
    elevator: PropTypes.string,
};

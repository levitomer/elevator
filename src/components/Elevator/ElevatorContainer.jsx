import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Elevator from './Elevator';
import logo from 'assets/logo.png';

export default function ElevatorContainer({ elevator }) {
    const stops = useSelector((state) => state[elevator].stops);
    const currentFloor = useSelector((state) => state[elevator].currentFloor);
    const message = useSelector((state) => state[elevator].message);

    return (
        <div>
            <p className="logger">{message}</p>
            <div className="panel">
                <div className="elevator">
                    <img src={logo} width="80px" height="50px" alt="Logo" />
                    <div>{elevator}</div>
                </div>
                <Elevator
                    stops={stops}
                    elevator={elevator}
                    currentFloor={currentFloor}
                />
            </div>
        </div>
    );
}

ElevatorContainer.propTypes = {
    elevator: PropTypes.string,
};

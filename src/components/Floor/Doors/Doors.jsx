import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useSound from 'use-sound';
import doorBell from 'assets/doorBell.mp3';

export default function Doors({ floor, doors, currentFloor }) {
    const [play] = useSound(doorBell, { volume: 0.05 });
    const doorWidth = (floor) => {
        return currentFloor === floor && doors === 'open' ? '0%' : '50%';
    };

    useEffect(() => {
        if (doors === 'open') {
            play();
        }
    }, [doors]);

    return (
        <div id="doors">
            <div id="left-door" style={{ width: doorWidth(floor) }} />
            <div id="right-door" style={{ width: doorWidth(floor) }} />
        </div>
    );
}

Doors.propTypes = {
    floor: PropTypes.number,
    currentFloor: PropTypes.number,
    doors: PropTypes.string,
};

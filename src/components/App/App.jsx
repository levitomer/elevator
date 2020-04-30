import React from 'react';
import FloorContainer from '../Floor/FloorContainer';
import ElevatorContainer from '../Elevator/ElevatorContainer';

const NUM_OF_ELEVATORS = ['A', 'B'];

export default function App() {
    return (
        <div id="page">
            {NUM_OF_ELEVATORS.map((id) => (
                <div key={id} className="wrapper">
                    <ElevatorContainer elevator={id} />
                    <FloorContainer elevator={id} />
                </div>
            ))}
        </div>
    );
}

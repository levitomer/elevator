import * as types from './types';

export function callFloor(elevator, floor) {
    return {
        type: types.CALL_FLOOR,
        elevator,
        floor,
    };
}

export function callElevator(elevator, floor, direction) {
    // the direction is used to discern if the elevator stops on call or not
    // the direction should be the same as the current moving direction
    return {
        type: types.CALL_ELEVATOR,
        elevator,
        floor,
        direction,
    };
}

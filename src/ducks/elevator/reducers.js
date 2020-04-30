import { combineReducers } from 'redux-loop';
import { Cmd, loop } from 'redux-loop';
import * as types from './types';
import {
    delay,
    checkIfTargetHit,
    decideNextTarget,
    decideNextFloor,
} from 'utils';

const floors = [0, 1, 2, 3, 4, 5, 6];
const stops = floors.map((_, index) => ({
    stop: false,
    number: index,
    time: 0,
}));

const initialState = {
    currentFloor: 0,
    nextTargetFloor: null,
    moving: false,
    stops: stops,
    doors: 'closed',
    message: '',
};

function elevator(state = initialState, action) {
    switch (action.type) {
        case types.LOG_MESSAGE: {
            return {
                ...state,
                message: action.message,
            };
        }

        case types.CALL_ELEVATOR: {
            // this calling from outside is not yet implemented
            // update stops queue
            const stops = state.stops.map(
                (floor, index) =>
                    index === action.floor
                        ? { ...floor, stop: action.direction }
                        : floor,
                state.stops
            );
            // check if requested direction is equal to the ongoing one
            // in order to set this fromFloor as nextTargetFloor else this floor wont be the next stop
            // come back to this
            const nextTargetFloor =
                state.nextTargetFloor === null
                    ? action.floor
                    : action.direction === state.direction
                    ? action.floor
                    : state.nextTargetFloor;
            const initialDirection =
                state.currentFloor < action.floor ? 'UP' : 'DOWN';
            const direction = state.direction
                ? state.direction
                : initialDirection;

            const newState = {
                ...state,
                stops,
                nextTargetFloor,
                direction,
                message: `Called from floor ${action.floor} for direction ${action.direction}`,
            };
            const nextAction = state.moving
                ? { type: types.DECIDE_NEXT_TARGET, elevator: action.elevator }
                : { type: types.START_MOVING, elevator: action.elevator };
            const newCmd = Cmd.action(nextAction);
            return loop(newState, newCmd);
        }

        case types.CALL_FLOOR: {
            const nextTargetFloor =
                state.nextTargetFloor === null
                    ? action.floor
                    : state.nextTargetFloor;
            const initialDirection =
                action.floor > state.currentFloor ? 'UP' : 'DOWN'; // ADD conditions for same floor !!!
            const direction =
                state.nextTargetFloor === null
                    ? initialDirection
                    : state.direction;
            // update stops queue
            const stops = state.stops.map(
                (floor, index) =>
                    index === action.floor ? { ...floor, stop: true } : floor,
                state.stops
            );

            const newState = {
                ...state,
                stops,
                nextTargetFloor,
                direction,
                message: `Doors closing. Going ${direction}. Next floor ${nextTargetFloor}`,
            };
            // if is moving already redecide NEXT TARGET !!!
            // else start moving
            const nextAction = state.moving
                ? { type: types.DECIDE_NEXT_TARGET, elevator: action.elevator }
                : { type: types.START_MOVING, elevator: action.elevator };
            const newCmd = Cmd.action(nextAction);
            return loop(newState, newCmd);
        }
        case types.DECIDE_NEXT_TARGET: {
            // if the new request is on my way (meaning has sto true or the same direction)
            // then nextTargetFloor will be the new floor requested
            // else do nothing -> just return state
            const [nextTargetFloor, direction] = decideNextTarget(state);

            const newState = {
                ...state,
                nextTargetFloor,
                message: `Next floor ${nextTargetFloor}`,
                direction,
            };
            return newState;
        }

        case types.START_MOVING: {
            const nextFloor = decideNextFloor(
                state.currentFloor,
                state.nextTargetFloor
            );
            const newState = {
                ...state,
                moving: true,
            };
            const newCmd = Cmd.run(delay, {
                args: [nextFloor],
                successActionCreator: (floor) => {
                    return {
                        type: types.SET_CURRENT_FLOOR,
                        elevator: action.elevator,
                        floor,
                    };
                },
            });
            return loop(newState, newCmd);
        }
        case types.SET_CURRENT_FLOOR: {
            const newState = {
                ...state,
                currentFloor: action.floor,
            };
            const nextAction = checkIfTargetHit(state, action.floor)
                ? Cmd.action({
                      type: types.HIT_TARGET_FLOOR,
                      elevator: action.elevator,
                  })
                : Cmd.action({
                      type: types.START_MOVING,
                      elevator: action.elevator,
                  });
            return loop(newState, nextAction);
        }
        case types.HIT_TARGET_FLOOR: {
            // OPEN THE DOORS and let people go in / out
            // clear the old target from the stops queue
            const newStops = state.stops.map(
                (floor, index) =>
                    index === state.nextTargetFloor
                        ? { ...floor, stop: false }
                        : floor,
                state.stops
            );
            const newState = {
                ...state,
                doors: 'open',
                message: `At floor ${state.nextTargetFloor}. Doors opening`,
                stops: newStops,
            };

            return loop(
                newState,
                Cmd.action({
                    type: types.TARGET_FLOOR_STANDBY,
                    elevator: action.elevator,
                })
            );
        }
        case types.TARGET_FLOOR_STANDBY: {
            const newCmd = Cmd.run(delay, {
                // delay because we open doors
                successActionCreator: () => {
                    // decide if end moving or reset next target
                    const shouldContinue = state.stops.some(
                        (floor) => floor.stop
                    );
                    const nextAction = shouldContinue
                        ? {
                              type: types.RESET_NEXT_TARGET,
                              elevator: action.elevator,
                          }
                        : { type: types.END_MOVING, elevator: action.elevator };
                    return nextAction;
                },
            });
            return loop(state, newCmd);
        }
        case types.RESET_NEXT_TARGET: {
            const [nextTargetFloor, direction] = decideNextTarget(state);
            const newState = {
                ...state,
                doors: 'closed',
                message: `Doors closing. Going ${direction}. Next floor ${nextTargetFloor}`,
                nextTargetFloor,
                direction,
            };
            const nextAction = Cmd.action({
                type: types.START_MOVING,
                elevator: action.elevator,
            });
            return loop(newState, nextAction);
        }

        case types.END_MOVING:
            return {
                ...state,
                message: '',
                moving: false,
                doors: 'closed',
                direction: null,
                nextTargetFloor: null,
            };
        default: {
            return state;
        }
    }
}

function createNamedWrapperReducer(reducerFunction, reducerName) {
    return (state, action) => {
        const { elevator } = action;
        const isInitializationCall = state === undefined;

        if (elevator !== reducerName && !isInitializationCall) return state;

        return reducerFunction(state, action);
    };
}

export const reducers = combineReducers({
    A: createNamedWrapperReducer(elevator, 'A'),
    B: createNamedWrapperReducer(elevator, 'B'),
});

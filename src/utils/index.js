export function assignElevator(elevators, direction, floor) {
    const { A, B } = elevators;

    if (Math.abs(B.currentFloor - floor) > Math.abs(A.currentFloor - floor)) {
        return 'A';
    }
    return 'B';
}

export function delay(data) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(data);
        }, 2000);
    });
}

export function checkIfTargetHit(
    { direction, stops, nextTargetFloor },
    toFloor
) {
    if (toFloor === nextTargetFloor) {
        if (stops[toFloor].stop === true) {
            // if requested from inside
            return true;
        } else if (direction === stops[toFloor].stop) {
            // if requested from outside but on the way
            return true;
        } else {
            // check if there's no other target on the current way(direction)
            // then i don't care about the outside request direction means i hit the target
            return !checkIfAnotherTargetOnTheWay(toFloor, stops, direction);
        }
    } else {
        return false;
    }
}

function checkIfAnotherTargetOnTheWay(thisFloor, stops, direction) {
    // return BOOLEAN
    if (direction === 'UP') {
        // check if any target UP
        return stops.some(
            (floor) =>
                floor.number > thisFloor &&
                isRequestedFromInsideOrItsOnTheWay(floor, direction)
        );
    } else if (direction === 'DOWN') {
        // check if any target DOWN
        return [...stops]
            .reverse()
            .some(
                (floor) =>
                    floor.number < thisFloor &&
                    isRequestedFromInsideOrItsOnTheWay(floor, direction)
            );
    } else {
        // eslint-disable-next-line no-console
        console.error('Big error if i arrive here.');
    }
}

function isRequestedFromInsideOrItsOnTheWay(floor, direction) {
    return floor.stop === true || floor.stop === direction;
}

export function decideNextTarget(state) {
    // returns nextTarget and (new)direction
    // this fn decides the next floor requested by users and changes direction if needed or just returns the same state
    const { nextTargetFloor, currentFloor, stops, direction } = state;
    if (direction === 'UP') {
        // check nearest UP
        const nearestUP = stops.find(
            (floor) =>
                floor.number > currentFloor &&
                isRequestedFromInsideOrItsOnTheWay(floor, direction)
        );
        // if found return it
        if (nearestUP) {
            return [nearestUP.number, 'UP'];
        } else {
            // change direction to DOWN
            const nearestDOWN = [...stops]
                .reverse()
                .find(
                    (floor) =>
                        floor.number < currentFloor &&
                        isRequestedFromInsideOrItsOnTheWay(floor, 'DOWN')
                );
            if (nearestDOWN) {
                return [nearestDOWN.number, 'DOWN'];
            } else {
                return [nextTargetFloor, direction];
            }
        }
    } else if (direction === 'DOWN') {
        const nearestDOWN = [...stops]
            .reverse()
            .find(
                (floor) =>
                    floor.number < currentFloor &&
                    isRequestedFromInsideOrItsOnTheWay(floor, direction)
            );
        // if found return it
        if (nearestDOWN) {
            return [nearestDOWN.number, 'DOWN'];
        } else {
            // change direction to UP
            const nearestUP = stops.find(
                (floor) =>
                    floor.number > currentFloor &&
                    isRequestedFromInsideOrItsOnTheWay(floor, 'UP')
            );
            if (nearestUP) {
                return [nearestUP.number, 'UP'];
            } else {
                return [nextTargetFloor, direction];
            }
        }
    } else {
        return [nextTargetFloor, direction];
    }
}

export function decideNextFloor(current, toFloor) {
    const floors = [0, 1, 2, 3, 4, 5, 6];
    // this fn decides the next floor (+1 / -1) depending on nextTarget
    if (current > toFloor) {
        return floors[current - 1];
    } else if (current < toFloor) {
        return floors[current + 1];
    } else {
        // if equals
        const message =
            'You are now at floor ' +
            current +
            '. You called the elevator for going to the same floor as you are now.';
        // eslint-disable-next-line no-console
        console.warn(message);
        return current;
    }
}

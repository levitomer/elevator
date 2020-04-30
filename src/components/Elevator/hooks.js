import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { callFloor } from 'ducks/elevator/actions';

export const useCallFloor = (elevator, floor) => {
    const dispatch = useDispatch();
    return useCallback(() => {
        dispatch(callFloor(elevator, floor));
    }, [dispatch]);
};

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { callElevator } from 'ducks/elevator/actions';

export const useCallElevator = (elevator, floor, direction) => {
    const dispatch = useDispatch();
    return useCallback(() => {
        dispatch(callElevator(elevator, floor, direction));
    }, [dispatch]);
};

import { Action, NEW_NUZLOCKE, DELETE_NUZLOCKE, SWITCH_NUZLOCKE, UPDATE_NUZLOCKE } from 'actions';
import * as uuid from 'uuid';

export interface Nuzlockes {
    currentId: string;
    saves: any[];
}

export function nuzlockes(
    state: Nuzlockes = {
        currentId: '',
        saves: []
    },
    action: Action<NEW_NUZLOCKE | DELETE_NUZLOCKE | SWITCH_NUZLOCKE | UPDATE_NUZLOCKE>,
) {
    switch (action.type) {
        case NEW_NUZLOCKE:
            const id = uuid();
            return {
                ...state,
                currentId: id,
                saves: [
                    ...state.saves,
                    {
                        id,
                        data: action?.data || null,
                        isCopy: action?.isCopy || false,
                    }
                ]
            };

        case DELETE_NUZLOCKE:
            return {
                ...state,
                saves: state.saves.filter(s => s.id !== action.id)
            };
        case SWITCH_NUZLOCKE:
            return {
                ...state,
                currentId: action.id,
            };
        case UPDATE_NUZLOCKE:
            const updateItem = state.saves.find(s => s.id === action.id);
            if (!updateItem) {
                return {
                    ...state,
                    saves: [
                        ...state.saves.filter(s => s.id !== action.id),
                        {
                            id: uuid(),
                            data: action.data,
                        }
                    ]
                };
            }
            return {
                ...state,
                saves: [
                    ...state.saves.filter(s => s.id !== action.id),
                    {
                        id: updateItem.id,
                        data: action.data,
                    }
                ]
            };
        default:
            return state;
    }
}

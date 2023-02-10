const initialState: number = 1;

const pageReducer = (pageNumber = initialState, action: { type: string; payload: number; }) => {

    switch (action.type) {
        case 'PAGE_NUMBER':
            return action.payload
        default: return pageNumber
    }
}

export default pageReducer;
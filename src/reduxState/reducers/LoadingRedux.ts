const intialState = { show: false };
const LoadingRedux = (state = intialState, action: { type: any; payload: any; }) => {

    switch (action.type) {
        case 'LOADING': return { show: action.payload }

        default: return state
    }
}
export default LoadingRedux;
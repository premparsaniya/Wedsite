const intialState = { mypost: [] };

const MyPostReducer = (state = intialState, action: { type: any; payload: any; }) => {
  switch (action.type) {
    case "UPDATEPOST": {
      return { ...state, mypost: action.payload };
    }
    case "LOGOUT": {
      return { ...intialState };
    }
    case "LIKE":
      return { ...state, mypost: action.payload };
    default:
      return state;
  }
};
export default MyPostReducer;

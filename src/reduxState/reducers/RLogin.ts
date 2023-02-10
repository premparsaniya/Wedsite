const intialState = {
    user: {
        data: {
            name: "",
            email: "",
            bio: "",
            dob: "",
            gender: "",
            mobile: "",
            token: "",
            photo: "",
            user_id: "",
            user_type: "",
            status: "",
            is_password_set: "",
            total_followers: "",
            total_followings: "",
            total_follow_requests: "",
            noti_badge_count: "",
            settings: {
                profile: "",
                notification: "",
                preference: "",
                activity: "",
                check_in: "",
                level: "",
                phase: "",
                streak_days: "",
            },
            activity_instructions: null,
            posts: [
                {
                    total_post: "",
                    reference_post: [],
                },
            ],
        },
        token: "",
        session_id: "",
        message: "",
        status: "",
    },
};

const UserLogin = (state = intialState, action: { type: string; payload: any; }) => {
    switch (action.type) {
        case "LOGIN": {
            return { ...state, user: action.payload };
        }
        case "LOGOUT": {
            return { ...intialState };
        }
        default: return state;
    }
};
export default UserLogin;

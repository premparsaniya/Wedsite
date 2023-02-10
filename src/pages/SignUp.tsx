import { ChangeEvent, useState } from "react";
import { BTN, DownBox } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { BLACK_LOGO } from "../assets";
import DatePicker from "react-datepicker";

const SignUp = () => {
  const [nm, setNM] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [date, setDate] = useState<string | number | Date>("");
  const [gender, setGender] = useState<string>();
  const [terms, setTerms] = useState<boolean>(false);
  // const dispatch = useDispatch();
  const [error, setError] = useState<string>("");
  const [myLoading, setMyLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  const signup = () => {
    setError("");
    var d = new Date(date as Date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    const formetedDate = [year, month, day].join("-");
    const userObj = {
      method: "do_register",
      name: nm,
      email: email,
      gender: gender,
      password: password,
      dob: formetedDate,
    };

    setMyLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        version: "1.0.0",
      },
      body: JSON.stringify(userObj),
    })
      .then((result) => {
        result.json().then((ress) => {
          if (ress?.status === 1) {
            convertResponse(ress);
            setMyLoading(false);
            navigate("/login");
            // console.log("signup", ress);
          } else {
            // console.log("signup  1", ress);
            setError(ress.message);
            setMyLoading(false);
          }
        });
      })
      .catch((e) => {
        setError(e.message);
      });
  };

  const convertResponse = (res: any) => {
    // const Obj = {
    //     userName: res?.data.name,
    //     Email: res?.data.email,
    //     Bio: res?.data.bio,
    //     Dob: res?.data.dob,
    //     Gender: res?.data.gender,
    //     Mobile: res?.data.mobile,
    //     Token: res?.extra.token,
    // }
    // // console.log('RESULT', JSON.stringify(result));
    // // console.log('RES --- ', res);
    // dispatch(SignUpUser());
  };

  return (
    <section className="sign-up-main-sec">
      <div className="root-container-s">
        <div className="box-s">
          <div className="s-insta-logo-div">
            <div className="s-insta-logo">
              <img src={BLACK_LOGO} className="s-nav-logo1" alt="hh"></img>
            </div>
            <span className="sign-up-text">Sign up</span>
          </div>
          <div className="sign-login-inp">
            <input
              type="text"
              placeholder="Full Name"
              className="u-inp"
              value={nm}
              onChange={(e) => {
                setNM(e.target.value), setError("");
              }}
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              className="u-inp"
              onChange={(e) => {
                setEmail(e.target.value), setError("");
              }}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-inp"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value), setError("");
              }}
            />
            <div className="sign-radio s-l-r text-white ">
              {/* <div>
              <input
                type="radio"
                value="M"
                checked={gender === "M"}
                onChange={handleChange}
              />
              <span style={{ marginLeft: "5px" }}>Male</span>
            </div>
            <div>
              <input
                type="radio"
                value="F"
                checked={gender === "F"}
                onChange={handleChange}
              />
              <span style={{ marginLeft: "5px" }}>Female</span>
            </div>
            <div>
              <input
                type="radio"
                value="O"
                checked={gender === "O"}
                onChange={handleChange}
              />
              <span style={{ marginLeft: "5px" }}>Other</span>
            </div> */}
              <div className="flex items-center mr-4">
                <input
                  id="male-radio"
                  type="radio"
                  checked={gender === "M"}
                  name="inline-radio-group"
                  value="M"
                  className="radio-comp"
                  onChange={handleChange}
                />
                <label htmlFor="male-radio" className="radio-label text-lg text-white ">
                  Male
                </label>
              </div>
              <div className="flex items-center mr-4">
                <input
                  id="female-radio"
                  type="radio"
                  checked={gender === "F"}
                  value="F"
                  name="inline-radio-group"
                  className="radio-comp"
                  onChange={handleChange}
                />
                <label htmlFor="female-radio" className="radio-label text-lg text-white">
                  Female
                </label>
              </div>
              <div className="flex items-center mr-4">
                <input
                  id="other-radio"
                  type="radio"
                  value="O"
                  checked={gender === "O"}
                  name="inline-radio-group"
                  className="radio-comp"
                  onChange={handleChange}
                />
                <label htmlFor="other-radio" className="radio-label text-lg text-white">
                  Other
                </label>
              </div>
            </div>
            <div className="sign-date-pikker">
              <DatePicker
                className="p-inp"
                placeholderText="mm / dd / yyyy"
                selected={date as Date}
                onChange={(d) => {
                  d && setDate(d), setError("");
                }}
                showMonthDropdown
                showYearDropdown
              />
            </div>
            <div className="s-check-div">
              <input
                type="checkbox"
                className="s-checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked), setError("");
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') { signup() } }}
              />{" "}
              <Link className="ml-2" to="/Terms_and_Conditions">Terms and Conditions</Link>
            </div>
          </div>
          <div className="s-btn-div">
            {/* <button
            className={terms ? "s-btn-ac" : "s-btn"}
            onClick={() => signup()}
            disabled={terms ? false : true}
          >
            {myLoading ? <MyLoading className={`lds-dual-ring`} /> : "Sign Up"}
          </button>
           */}
            <BTN
              className="px-32"
              onP={signup}
              loading={myLoading}
              title="Sign Up"
              disabled={
                myLoading || (nm !== "" && email !== "" && password !== "" && date !== "" && gender !== "" && terms)
                  ? false
                  : true
              }
            />
          </div>
        </div>
        <DownBox
          text={`Have an account?`}
          linkName={`Log in`}
          page={`/login`}
          className={"s-under-box"}
        />
        {error ? (
          <div className="signup-error-box">
            <h1>{error}</h1>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default SignUp;

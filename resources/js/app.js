require("./bootstrap");
import React, { Component } from "react";

import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Loader from "react-loader-spinner";
import { motion } from "framer-motion";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";

import UserTestSpeedUp from "./pages/UserTestSpeedUp";
import UserHeader from "./pages/UserHeader";
import UserChooseCourse from "./pages/UserChooseCourse";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { LanguageContext } from "./context/LanguageContext";
import GlobalLoading from "./components/GlobalLoading";
import { LoadingContext } from "./context/LoadingContext";
import { NotifyContext } from "./context/NotifyContext";
import Logout from "./pages/Logout";
import SupperAdminCompany from "./pages/SupperAdminCompany";
import SupperAdminSpeedUpQuestion from "./pages/SupperAdminSpeedUpQuestion";
import SupperAdminUsers from "./pages/SupperAdminUsers";
import UserCompanyList from "./pages/UserCompanyList";
import UserCompanyCreate from "./pages/UserCompanyCreate";
import UserCompanyPending from "./pages/UserCompanyPending";
import UserDetail from "./pages/UserDetail";
import ResultDetail from "./pages/ResultDetail";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "../lang/en/translation.json";
import translationJA from "../lang/ja/translation.json";
import translationVI from "../lang/vi/translation.json";
import SupperAdminTranslation from "./pages/SupperAdminTranslation";

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: translationEN
            },
            ja: {
                translation: translationJA
            },
            vi: {
                translation: translationVI
            }
        },
        lng: "vi",
        fallbackLng: "vi",

        interpolation: {
            escapeValue: false
        }
    });

const notifySuccess = (message = "Success") => {
    toast(message, {
        autoClose: "5000",
        type: toast.TYPE.SUCCESS
    });
};
const notifyError = (
    message = "A unknown error has error, please try again later"
) => {
    toast(message, {
        autoClose: "5000",
        type: toast.TYPE.ERROR
    });
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialize: true,
            token: null,
            user: {},
            lang: 1,
            loader: false
        };
        this.setToken = this.setToken.bind(this);
        this.setUser = this.setUser.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem("session_token");
        const user = localStorage.getItem("user") || "{}";

        this.setState({ token: token, user: JSON.parse(user) }, () => {
            this.setState({
                initialize: false
            });
        });
    }
    setToken(token) {
        this.setState({ token });
    }
    setUser(user) {
        this.setState({ user: user });
    }
    render() {
        const { initialize, token, user, lang, loader } = this.state;
        return (
            <NotifyContext.Provider
                value={{
                    success: notifySuccess,
                    error: notifyError
                }}
            >
                <LanguageContext.Provider
                    value={{
                        lang,
                        setLang: lang => {
                            if (lang == 1) {
                                i18n.changeLanguage("vi");
                            } else if (lang == 2) {
                                i18n.changeLanguage("ja");
                            } else {
                                i18n.changeLanguage("en");
                            }
                            this.setState({ lang: lang });
                        }
                    }}
                >
                    <LoadingContext.Provider
                        value={{
                            loader,
                            setLoader: state => this.setState({ loader: state })
                        }}
                    >
                        <AuthContext.Provider
                            value={{
                                token,
                                user,
                                setToken: this.setToken,
                                setUser: this.setUser
                            }}
                        >
                            {initialize ? (
                                <div className="absolute right-0 bottom-0 top-0 left-0 flex items-center justify-center">
                                    <div className="flex items-center flex-col justify-center">
                                        <motion.img
                                            className="h-40"
                                            initial={{
                                                translateY: 50,
                                                opacity: 0
                                            }}
                                            animate={{
                                                translateY: 0,
                                                opacity: 1
                                            }}
                                            src={
                                                window.baseURL +
                                                "/public/images/logo.png"
                                            }
                                        />
                                        <Loader
                                            type="ThreeDots"
                                            color="#004c98"
                                            height={100}
                                            radius={10}
                                            width={100}
                                            timeout={0} //3 secs
                                        />
                                    </div>
                                </div>
                            ) : (
                                <BrowserRouter>
                                    <Switch>
                                        <Route path="/logout" exact>
                                            <Logout />
                                        </Route>
                                        <Route path="/login" exact>
                                            {token == null ? (
                                                <Login />
                                            ) : (
                                                <Redirect
                                                    to={{
                                                        pathname: "/"
                                                    }}
                                                />
                                            )}
                                        </Route>

                                        {token !== null ? (
                                            <Switch>
                                                {user.type == 0 ? (
                                                    <Switch>
                                                        <Route
                                                            path="/admin/company"
                                                            exact
                                                        >
                                                            <SupperAdminCompany />
                                                        </Route>
                                                        <Route
                                                            path="/admin/users"
                                                            exact
                                                        >
                                                            <SupperAdminUsers />
                                                        </Route>
                                                        <Route
                                                            path="/admin/questions/speedup"
                                                            exact
                                                        >
                                                            <SupperAdminSpeedUpQuestion />
                                                        </Route>
                                                        <Route
                                                            path="/admin/translation"
                                                            exact
                                                        >
                                                            <SupperAdminTranslation />
                                                        </Route>
                                                        <Redirect to="/admin/company" />
                                                    </Switch>
                                                ) : user.type == 1 ? (
                                                    <Switch>
                                                        <Route path="/" exact>
                                                            <Redirect to="/speedup" />
                                                        </Route>
                                                        <Route
                                                            path="/speedup"
                                                            exact
                                                        >
                                                            <UserHeader />
                                                            <UserTestSpeedUp />
                                                        </Route>
                                                        <Redirect to="/" />
                                                    </Switch>
                                                ) : user.type == 2 ? (
                                                    <Switch>
                                                        <Route
                                                            path="/company/users/list"
                                                            exact
                                                        >
                                                            <UserCompanyList />
                                                        </Route>
                                                        <Route
                                                            path="/company/users/pending-invite"
                                                            exact
                                                        >
                                                            <UserCompanyPending />
                                                        </Route>
                                                        <Route
                                                            path="/company/users/add"
                                                            exact
                                                        >
                                                            <UserCompanyCreate />
                                                        </Route>
                                                        <Route
                                                            path="/company/users/:user_id/detail/:id"
                                                            exact
                                                        >
                                                            <ResultDetail />
                                                        </Route>
                                                        <Route
                                                            path="/company/users/:id"
                                                            exact
                                                        >
                                                            <UserDetail />
                                                        </Route>
                                                        <Redirect to="/company/users/list" />
                                                    </Switch>
                                                ) : (
                                                    <Redirect
                                                        to={{
                                                            pathname: "/login"
                                                        }}
                                                    />
                                                )}
                                            </Switch>
                                        ) : (
                                            <Route
                                                render={({ location }) => (
                                                    <Redirect
                                                        to={{
                                                            pathname: "/login",
                                                            state: {
                                                                from: location
                                                            }
                                                        }}
                                                    />
                                                )}
                                            ></Route>
                                        )}
                                    </Switch>
                                </BrowserRouter>
                            )}
                        </AuthContext.Provider>
                        {loader && <GlobalLoading />}
                    </LoadingContext.Provider>
                </LanguageContext.Provider>
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </NotifyContext.Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));

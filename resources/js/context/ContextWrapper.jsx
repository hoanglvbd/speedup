import React from "react";
import { LanguageContext } from "./LanguageContext";
import { LoadingContext } from "./LoadingContext";
import { NotifyContext } from "./NotifyContext";
import { AuthContext } from "./AuthContext";

function ContextWrapper(Component) {
    return class extends React.Component {
        constructor(props) {
            super(props);
        }
        render() {
            return (
                <NotifyContext.Consumer>
                    {notify => (
                        <LanguageContext.Consumer>
                            {lang => (
                                <LoadingContext.Consumer>
                                    {loader => (
                                        <AuthContext.Consumer>
                                            {auth => (
                                                <Component
                                                    loader={loader}
                                                    notify={notify}
                                                    lang={lang}
                                                    auth={auth}
                                                    {...this.props}
                                                />
                                            )}
                                        </AuthContext.Consumer>
                                    )}
                                </LoadingContext.Consumer>
                            )}
                        </LanguageContext.Consumer>
                    )}
                </NotifyContext.Consumer>
            );
        }
    };
}

export default ContextWrapper;

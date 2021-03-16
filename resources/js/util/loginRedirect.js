export function LoginRedirect(user) {
    if (user.type != 2) {
        window.location.replace("/admin");
    } else {
        if (user.type_member != 2) {
            window.location.replace("/company/users");
        } else {
            window.location.replace("/");
        }
    }
}

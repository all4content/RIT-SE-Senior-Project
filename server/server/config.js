/**
 * A place for global variables to be configured and made available
 */
const auth = require("basic-auth");
const path = require("path");

let authAdmin = function (req, res, next) {
    // TODO REMOVE THIS CODE ONCE PROPER AUTHORIZATION IS ADDED -- JUST FOR TESTING + DON"T FORGET TO UNINSTALL AUTH PACKAGES
    res.removeHeader("Authorization");
    next();
    return;
    // END OF TODO
    let user = auth(req);
    if (!user || !user.name || !user.pass) {
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        res.sendStatus(401);
        return;
    }
    if (user.name === "M" && user.pass === "123") {
        //console.log(req)
        //console.log('**********************')
        //console.log(res)
        res.removeHeader("Authorization");
        next();
    } else {
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        res.sendStatus(401);
        return;
    }
};

module.exports = {
    accepted_file_types: [
        ".pdf",
        ".jpeg",
        ".jpg",
        ".png",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".pptx",
        ".rtf",
        ".csv",
    ],
    authAdmin,
};

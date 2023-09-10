// Response(true/false, "This is message.", data)

module.exports.Response = (error, message = "", data = []) => {
    return { error, message, data };
};
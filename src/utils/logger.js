module.exports = {

    success(msg) {
        console.log(
            `✓ ${msg}`
        );
    },

    error(msg, err) {
        console.error(
            `✗ ${msg}`,
            err
        );
    },

    warn(msg) {
        console.warn(
            `⚠ ${msg}`
        );
    },

    info(msg) {
        console.log(
            `ℹ ${msg}`
        );
    }

};
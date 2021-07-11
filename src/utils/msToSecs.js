module.exports = (ms) => {
    const secs = Math.floor((ms % 60000) / 1000);

    return secs;
};
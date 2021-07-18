module.exports = (ms) => {
    if(!ms || ms.toString().trim().length === 0) throw new TypeError('ms cannot be null, undefined or empty!');

    const secs = Math.floor((ms % 60000) / 1000);

    return secs;
};
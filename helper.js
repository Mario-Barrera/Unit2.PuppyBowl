function formatTime12h(timeStr) {
    if (!timeStr) return '';        // if timeStr is fale, returns null

    const [hour, minute] = timeStr.split(':');      // splits the time string by the colon and turns it into an array
    let h = Number(hour);                           // converts hours into a number
    let m = minute;                                 // keeps minutes as a string, no changes
    let ampm = h >=12 ? 'PM' : 'AM';            // ternary operator
    
    h = h % 12 || 12;                   // converts time into a 12 hour format
    return h + ':' + m + ampm;          // concatenates the final format
}

module.exports = { formatTime12h };
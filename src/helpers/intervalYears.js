export function timeSince(date, against) {
    const dateThen = new Date(date);
    let seconds = 0;

    if (against) {
        seconds = Math.floor((dateThen - new Date()) / 1000);
        if (seconds < 0) return 'Ended';
    } else {
        seconds = Math.floor((new Date() - dateThen) / 1000);
    }

    if (seconds < 0) return '0 minute';

    var interval = seconds / 31536000;
    let response = '';

    if (interval > 1) {
        return Math.floor(interval) + 'year ' + (Math.floor(interval) > 1 ? 's' : '');
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + 'month ' + (Math.floor(interval) > 1 ? 's' : '');
    }
    interval = seconds / 86400;
    if (interval > 1) {
        response = Math.floor(interval) + 'd ';
        seconds -= Math.floor(interval) * 3600 * 24;
    }

    interval = seconds / 3600;
    if (interval > 1) {
        response += Math.floor(interval) + 'h ';
        seconds -= Math.floor(interval) * 3600;
    }

    interval = seconds / 60;
    return response + Math.floor(interval) + 'm ';
    // return Math.floor(seconds) + ' seconds';
}

export function getTimeLeft(start, end) {
    const now = new Date();
    const startDate = new Date(start * 1000);
    const endDate = new Date(end * 1000);
    if (startDate - now > 0) return `Starts ${timeSince(startDate, true)} `;

    return `${timeSince(endDate, true)}`;
}

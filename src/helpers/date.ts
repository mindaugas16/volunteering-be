export const dateToString = date => new Date(date).toISOString();

export const toDate = date => new Date(date);

export const compareDates = (a, b) => {
    a = a.setHours(0, 0, 0, 0);
    b = b.setHours(0, 0, 0, 0);

    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }

    return 0;
};

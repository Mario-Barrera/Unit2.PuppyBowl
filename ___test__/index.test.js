const { formatTime12h } = require('../helper')

describe('formatTime12h', () => {
    test('converts 00:00 to 12:00AM', () => {
        expect(formatTime12h("00:00")).toBe("12:00AM");
    });

    test('converts 12:00 to 12:00PM', () => {
        expect(formatTime12h("12:00")).toBe("12:00PM");
    });

    test('converts 14:30 to 2:30PM', () => {
        expect(formatTime12h("14:30")).toBe("2:30PM");
    });

    test('converts 01:05 to 1:05AM', () => {
        expect(formatTime12h("01:05")).toBe("1:05AM");
    });

    test('returns empty string if input is null', () => {
        expect(formatTime12h(null)).toBe('');
    });
});
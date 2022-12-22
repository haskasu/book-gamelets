import { test, expect } from 'vitest'
import { StringUtils } from '../lib/StringUtils';

test('capitalize', () => {
    expect(StringUtils.capitalize("you are a good-person."))
        .toBe("You Are A Good-Person.");
    expect(StringUtils.capitalize("clothes don't make the man."))
        .toBe("Clothes Don't Make The Man.");
});
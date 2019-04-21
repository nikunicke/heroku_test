const palindrom = require('../utils/for_testing').palindrom

test('Palindrom if a', () => {
    const result = palindrom('a')

    expect(result).toBe('a')
})

test('Palindrom of react', () => {
    const result = palindrom('react')

    expect(result).toBe('tcaer')
})

test('Palindrom of saippuakauppias', () => {
    const result = palindrom('saippuakauppias')

    expect(result).toBe('saippuakauppias')
})
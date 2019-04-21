const palindrom = string => {
    return string
        .split('')
        .reverse()
        .join('')
}

const average = array => {
    const reducer = (a, b) => {
        return a + b
    }

    return array.length === 0
        ? 0
        : array.reduce(reducer, 0) / array.length
}

module.exports = {
    palindrom,
    average
}
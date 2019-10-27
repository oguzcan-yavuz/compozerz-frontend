export const toTitleCase = (word) => {
    const [firstLetter, ...rest] = word.split('')
    return `${firstLetter.toUpperCase()}${rest.join('').toLowerCase()}`
}

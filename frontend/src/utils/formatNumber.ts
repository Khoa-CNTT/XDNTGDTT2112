export function formatNumber(number: number) {
    const reversedStr = number.toString().split('').reverse().join('');
    const formattedReversed = reversedStr.replace(/(\d{3})(?=\d)/g, '$1.');
    return formattedReversed.split('').reverse().join('');
  }
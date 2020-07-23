// Need to escape user inputs which may include " \ ^ $ * + ? . ( ) | { } [ ] "
// which would break regular expressions here
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const emboldenSubstring = (str, subStr) => {
	const regex = new RegExp(escapeRegExp(subStr), 'i');
	return str.replace(regex, '<strong>$&</strong>');
};

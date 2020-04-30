export const emboldenSubstring = ( str, subStr ) => {
  const regex = new RegExp(subStr, "ig");
  return str.replace( regex, "<strong>$&</strong>");
};

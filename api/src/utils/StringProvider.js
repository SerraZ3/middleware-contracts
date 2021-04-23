module.exports = {
  formatString: (
    string,
    {
      uppercase = false,
      spaces = false,
      specialChar = false,
      accent = false,
      numbers = false,
      all = false,
    }
  ) => {
    // Put in lowerCase or uppercase
    string = uppercase
      ? string.trim().toUpperCase()
      : string.trim().toLowerCase();

    if (all)
      return string
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "_")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // Remove all special character
    if (specialChar) {
      numbers
        ? (string = string.replace(/[^a-zA-Z0-9 ]/g, ""))
        : (string = string.replace(/[^a-zA-Z ]/g, ""));
    }

    // Remove all space and put _
    if (spaces) string = string.replace(/\s+/g, "_");

    // Remove all accent
    if (accent)
      string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return string;
  },
};

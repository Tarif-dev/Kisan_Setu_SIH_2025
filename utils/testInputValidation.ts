// Test input validation for soil health inputs
export const testInputValidation = () => {
  const validInputs = [
    "", // empty string
    "6", // integer
    "6.5", // decimal
    "6.", // partial decimal
    ".5", // decimal starting with dot
    "123.45", // multi-digit decimal
  ];

  const invalidInputs = [
    "abc", // letters
    "6.5.5", // multiple dots
    "6a", // mixed alphanumeric
    "-5", // negative (we could allow this if needed)
    "6 5", // spaces
  ];

  const regex = /^\d*\.?\d*$/;

  console.log("Testing valid inputs:");
  validInputs.forEach((input) => {
    const isValid = input === "" || regex.test(input);
    console.log(`"${input}" -> ${isValid ? "✓ Valid" : "✗ Invalid"}`);
  });

  console.log("\nTesting invalid inputs:");
  invalidInputs.forEach((input) => {
    const isValid = input === "" || regex.test(input);
    console.log(`"${input}" -> ${isValid ? "✓ Valid" : "✗ Invalid"}`);
  });
};

// Usage: testInputValidation();

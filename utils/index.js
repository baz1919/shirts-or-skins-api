export const rejectIf = (condition) => {
    if (!condition) {
      throw new Error("Unauthorized");
    }
  }
  
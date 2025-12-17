
/**
 * Removes HTML tags from a string to allow for text-based comparison.
 * e.g., "<p>Answer</p>" becomes "Answer"
 */
export const stripHtml = (html: string): string => {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

/**
 * Normalizes string for comparison.
 * 1. Trims whitespace.
 * 2. Attempts to strip HTML.
 * 3. If stripping results in empty string (e.g. the answer IS a tag like "<br>"), uses original string.
 * 4. Lowercases and collapses spaces.
 */
export const normalizeAnswer = (str: string): string => {
  if (!str) return "";
  const trimmed = str.trim();
  let content = stripHtml(trimmed);
  
  // If stripping HTML removes everything (meaning the answer was purely tags, like "<br>" or "<i>"),
  // we should compare the raw tag string instead of an empty string.
  // This fixes the bug where "<br>" and "<i>" were both treated as "" and thus considered equal.
  if (!content && trimmed.length > 0) {
    content = trimmed;
  }

  return content.replace(/\s+/g, ' ').toLowerCase();
};

/**
 * Sanitizes HTML string to remove dangerous tags that could cause
 * navigation, execution, or layout breaking when rendered.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";
  
  // Replace <meta> tags with their escaped version or empty string
  // Prevents <meta http-equiv="refresh"> from reloading the page
  let clean = html.replace(/<meta\s+[^>]*>/gi, "&lt;meta tag removed&gt;");
  
  // Remove scripts
  clean = clean.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "&lt;script removed&gt;");
  
  // Remove iframes/objects/embeds
  clean = clean.replace(/<(iframe|object|embed|base)\s+[^>]*>/gi, "&lt;$1 removed&gt;");

  return clean;
};

/**
 * Checks if the user answer matches the correct answer.
 * Handles single strings and arrays (for multiple choice).
 */
export const checkIsCorrect = (
  user: string | string[] | undefined,
  correct: string[] | undefined
): boolean => {
  if (!user || !correct || correct.length === 0) return false;

  const userArr = Array.isArray(user) ? user : [user];
  // Filter out empty user answers
  const cleanUserArr = userArr.filter(u => u && u.trim() !== '');
  
  if (cleanUserArr.length === 0) return false;

  const cleanCorrectArr = correct.map(normalizeAnswer);
  const cleanUserArrNormalized = cleanUserArr.map(normalizeAnswer);

  // If lengths differ, it's wrong (especially for multiple choice)
  if (cleanCorrectArr.length !== cleanUserArrNormalized.length) return false;

  // Check if every user answer is in the correct answers list
  // Sort both to ensure order doesn't matter
  const sortedUser = [...cleanUserArrNormalized].sort();
  const sortedCorrect = [...cleanCorrectArr].sort();

  return sortedUser.every((val, index) => val === sortedCorrect[index]);
};

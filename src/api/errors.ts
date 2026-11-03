/** No Gemini key saved yet — the UI should ask for one and retry. */
export class MissingKeyError extends Error {}

/** The saved Gemini key was rejected — the UI should clear it and ask again. */
export class InvalidApiKeyError extends Error {}

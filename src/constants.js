const TABS_COLLECTION = "tabs-0";
const TASKS_COLLECTION = "tasks";
const SHARED_USERS = "sharedUsers";

const ARIA_KEYS = ["Enter"];

const LOGIN_ERROR_MESSAGES = {
  "auth/invalid-email": "This email address is not valid. Please try again.",
  "auth/internal-error": "An error occurred. Please try again.",
  "auth/user-not-found": "Incorrect email address or password.",
  "auth/wrong-password": "Incorrect email address or password.",
}

const REGISTER_ERROR_MESSAGES = {
  "auth/email-already-in-use": "A user with this email address already exists."
}

export default {
  TABS_COLLECTION,
  TASKS_COLLECTION,
  SHARED_USERS,
  ARIA_KEYS,
  LOGIN_ERROR_MESSAGES,
  REGISTER_ERROR_MESSAGES
}
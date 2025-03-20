// List of authorized admin email addresses
export const ADMIN_EMAILS = [
  "ololadetimileyin3@gmail.com", // Replace with your actual admin email
  // "support@example.com", // Add more admin emails as needed
];

// Function to check if an email is authorized as admin
export const isAuthorizedAdmin = (email: string | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

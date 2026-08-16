// supabaseClient.js

// Make sure your URL starts with "https://" and ends with ".supabase.co"
const SUPABASE_URL = "https://ussmwxfdwfppusmvlcap.supabase.co"; 

// Make sure your key is the long string starting with "eyJ..."
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzc213eGZkd2ZwcHVzbXZsY2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3NDQxNTEsImV4cCI6MjEwMjMyMDE1MX0.mHCO2z-yYuRpjcV0XngBEFg5wu-FebS419xyIqnhZiQ"; 

/**
 * Converts a username/alias and birthdate into a birthday-formatted identity string.
 * @param {string} name - e.g., "admin" or "mimi"
 * @param {string} birthdate - e.g., "2000-01-01"
 * @returns {string} - e.g., "admin.2000-01-01@birthday.com"
 */
function createBirthdayEmail(name, birthdate) {
  if (!name || !birthdate) return "";
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanName}.${birthdate}@birthday.com`;
}

// Attach utility function globally so any page can call it
window.createBirthdayEmail = createBirthdayEmail;

// Example Usage:
// const formattedEmail = window.createBirthdayEmail("admin", "1995-05-12");
// Output: "admin.1995-05-12@birthday.com"

if (typeof supabase === 'undefined') {
  console.error("Supabase CDN library script is missing! Check your HTML script tags.");
} else {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("Supabase client initialized successfully!");
}
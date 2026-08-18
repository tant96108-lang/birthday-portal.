let currentGreetingIndex = 0;
let userGreetingsList = [];

// Helper functions (implement according to your existing UI/canvas logic)
async function connectUserToAdmin() {
  // Logic to connect user session to admin if required
}

async function loadUserGreeting(user) {
  // Fetch greetings from Supabase for this user and store in userGreetingsList
  const { data, error } = await window.supabaseClient
    .from('user_greetings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!error && data) {
    userGreetingsList = data;
    renderCurrentGreeting();
  }
}

function renderCurrentGreeting() {
  if (userGreetingsList.length === 0) return;
  const current = userGreetingsList[currentGreetingIndex];
  
  const textEl = document.getElementById("greetingText");
  if (textEl) textEl.textContent = current.greeting_text;
}

function drawCakeAnimation() {
  // Canvas or CSS animation logic for the birthday cake
}

// Main Dashboard Controller
document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabaseClient) {
    window.location.href = "login.html";
    return;
  }

  // 1. Get current logged-in user
  const { data: { user }, error: authError } = await window.supabaseClient.auth.getUser();

  if (authError || !user) {
    window.location.href = "login.html";
    return;
  }

  // 2. Fetch profile avatar URL from the 'profiles' table
  const { data: profile } = await window.supabaseClient
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single();

  const celebrantImg = document.getElementById('celebrantImg');

  if (profile && profile.avatar_url && celebrantImg) {
    celebrantImg.src = `${profile.avatar_url}?t=${new Date().getTime()}`;
  } else if (user.user_metadata?.avatar_url && celebrantImg) {
    celebrantImg.src = user.user_metadata.avatar_url;
  }

  // 3. Listen for Realtime Changes to profile photo
  window.supabaseClient
    .channel('public:profiles')
    .on('postgres_changes', { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'profiles', 
      filter: `id=eq.${user.id}` 
    }, payload => {
      if (payload.new && payload.new.avatar_url && celebrantImg) {
        celebrantImg.src = `${payload.new.avatar_url}?t=${new Date().getTime()}`;
      }
    })
    .subscribe();

  // 4. Extract user info and render UI elements
  const userMeta = user.user_metadata || {};
  const nickname = userMeta.nickname || user.email.split("@")[0];
  const celebrantNameEl = document.getElementById("celebrantName");
  if (celebrantNameEl) celebrantNameEl.textContent = nickname;

  // 5. Auto-connect user to admin upon dashboard load
  await connectUserToAdmin();

  // 6. Load custom greetings & images sent by the admin
  await loadUserGreeting(user);

  // 7. Listen for new greetings sent by Admin in real-time
  window.supabaseClient
    .channel('public:user_greetings')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'user_greetings', 
      filter: `user_id=eq.${user.id}` 
    }, async (payload) => {
      await loadUserGreeting(user);
    })
    .subscribe();

  // 8. Start Intro Cake Animation
  drawCakeAnimation();

  // 9. Envelope open handler
  const greetingsBtn = document.getElementById("greetingsBtn");
  const envelope = document.getElementById("envelope");

  if (greetingsBtn && envelope) {
    greetingsBtn.addEventListener("click", () => {
      envelope.classList.add("visible");
      setTimeout(() => {
        envelope.classList.add("open");
      }, 300);
    });
  }

  // 10. Navigation buttons event listeners for multiple greetings
  const prevBtn = document.getElementById("prevGreetingBtn");
  const nextBtn = document.getElementById("nextGreetingBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentGreetingIndex > 0) {
        currentGreetingIndex--;
        renderCurrentGreeting();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentGreetingIndex < userGreetingsList.length - 1) {
        currentGreetingIndex++;
        renderCurrentGreeting();
      }
    });
  }
});
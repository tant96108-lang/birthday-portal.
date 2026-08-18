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
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, payload => {
      if (payload.new && payload.new.avatar_url && celebrantImg) {
        celebrantImg.src = `${payload.new.avatar_url}?t=${new Date().getTime()}`;
      }
    })
    .subscribe();

  // 4. Extract user info and render UI elements
  const userMeta = user.user_metadata || {};
  const nickname = userMeta.nickname || user.email.split("@")[0];
  document.getElementById("celebrantName").textContent = nickname;

  // 5. Auto-connect user to admin upon dashboard load
  await connectUserToAdmin();

  // 6. Load custom greetings & images sent by the admin
  await loadUserGreeting(user);

  // =========================================================
  // 👇 PASTE YOUR NEW REALTIME GREETING LISTENER HERE 👇
  // =========================================================
  window.supabaseClient
    .channel('public:user_greetings')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'user_greetings', 
      filter: `user_id=eq.${user.id}` 
    }, async (payload) => {
      // Reload greetings automatically when admin posts a new one
      await loadUserGreeting(user);
    })
    .subscribe();
  // =========================================================

  // 7. Start Intro Cake Animation
  drawCakeAnimation();

  // 8. Envelope open handler
  const greetingsBtn = document.getElementById("greetingsBtn");
  const envelope = document.getElementById("envelope");

  greetingsBtn.addEventListener("click", () => {
    envelope.classList.add("visible");
    setTimeout(() => {
      envelope.classList.add("open");
    }, 300);
  });

  // 9. Navigation buttons event listeners for multiple greetings
  document.getElementById("prevGreetingBtn").addEventListener("click", () => {
    if (currentGreetingIndex > 0) {
      currentGreetingIndex--;
      renderCurrentGreeting();
    }
  });

  document.getElementById("nextGreetingBtn").addEventListener("click", () => {
    if (currentGreetingIndex < userGreetingsList.length - 1) {
      currentGreetingIndex++;
      renderCurrentGreeting();
    }
  });
});
// 1. Initialize Supabase (Replace with your actual keys!)
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const wishForm = document.getElementById('wishForm');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');
const feed = document.getElementById('feed');

// 2. Fetch and render existing greetings on page load
async function loadGreetings() {
  const { data: greetings, error } = await supabase
    .from('greetings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching greetings:', error);
    feed.innerHTML = '<p class="empty-state">Error loading messages.</p>';
    return;
  }

  if (greetings.length === 0) {
    feed.innerHTML = '<p class="empty-state">No greetings created yet. Add one above!</p>';
    return;
  }

  feed.innerHTML = '';
  greetings.forEach(greeting => renderCard(greeting));
}

// 3. Render a single greeting card into the DOM
function renderCard(item) {
  const greetingCard = document.createElement('div');
  greetingCard.classList.add('greeting-item');

  const rsvpText = item.rsvp ? '✅ RSVP Confirmed!' : 'Confirm RSVP';
  const rsvpDisabled = item.rsvp ? 'disabled' : '';

  greetingCard.innerHTML = `
    <h3>🎈 Happy Birthday, ${item.name}!</h3>
    <p>"${item.message}"</p>
    <button class="rsvp-btn" ${rsvpDisabled} onclick="toggleRSVP(${item.id}, this)">
      ${rsvpText}
    </button>
  `;

  feed.appendChild(greetingCard);
}

// 4. Save new greeting to Supabase
wishForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newWish = {
    name: nameInput.value,
    message: messageInput.value,
    rsvp: false
  };

  const { data, error } = await supabase
    .from('greetings')
    .insert([newWish]);

  if (error) {
    alert('Error saving greeting: ' + error.message);
  } else {
    nameInput.value = '';
    messageInput.value = '';
    loadGreetings(); // Reload feed to show saved data
  }
});

// 5. Update RSVP status in Supabase
async function toggleRSVP(id, buttonElement) {
  const { error } = await supabase
    .from('greetings')
    .update({ rsvp: true })
    .eq('id', id);

  if (error) {
    alert('Error updating RSVP: ' + error.message);
  } else {
    buttonElement.textContent = '✅ RSVP Confirmed!';
    buttonElement.disabled = true;
  }
}

// Run when the page loads
loadGreetings();
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  CURRICULUM: '/curriculum',
  SCAM_SIMULATOR: '/scam-simulator',
  EXCHANGE_LOG: '/exchange-log',
  PROGRESS: '/progress',
  SENIOR_DIRECTORY: '/seniors', 
}

export const ROLES = {
  SENIOR: 'senior',
  TEEN: 'teen',
}

export const SENIOR_AGE_RANGES = [
  { value: '55-64', label: '55 – 64' },
  { value: '65-74', label: '65 – 74' },
  { value: '75-85', label: '75 – 85' },
  { value: '85+', label: '85 or older' },
]

export const SENIOR_BACKGROUNDS = [
  'Doctor',
  'Nurse',
  'Engineer',
  'Farmer',
  'Teacher',
  'Accountant',
  'Veteran',
  'Tradesperson',
  'Business Owner',
  'Other',
]

export const SENIOR_LEARNING_GOALS = [
  { value: 'smartphone', label: 'Using my smartphone' },
  { value: 'video-calling', label: 'Video calling family' },
  { value: 'online-safety', label: 'Staying safe online' },
  { value: 'ai-tools', label: 'Understanding AI tools' },
  { value: 'gov-websites', label: 'Using government websites' },
]

export const TEEN_INTEREST_AREAS = [
  'Medicine',
  'Engineering',
  'Agriculture',
  'Business',
  'Education',
  'Law',
  'Arts',
  'Technology',
  'Finance',
  'Other',
]

export const TEEN_AGE_OPTIONS = [13, 14, 15, 16, 17, 18, 19]

export const SCAM_TYPES = [
  { value: 'email', label: 'Email Scam' },
  { value: 'sms', label: 'Text Message Scam' },
  { value: 'phone', label: 'Phone Call Scam' },
  { value: 'investment', label: 'Investment Scam' },
  { value: 'romance', label: 'Romance Scam' },
]

export const CURRICULUM_TRACKS = [
  {
    id: 'smartphone-basics',
    title: 'Smartphone Basics',
    icon: 'smartphone',
    color: 'blue',
    description: 'Learn the fundamentals of your smartphone, from turning it on to sending your first text.',
    sessions: [
      {
        number: 1,
        title: 'Getting Started with Your Phone',
        objective: 'Learn how to turn your phone on and off, adjust the volume, and make the text bigger so it\'s easier to read.',
        duration: '25 minutes',
        skills: [
          'Turn your phone on and off',
          'Adjust the volume using the side buttons',
          'Change the text size in Settings to make everything easier to read',
        ],
        teachingGuide: [
          'Start by holding the phone together and finding the power button (usually on the right side or top).',
          'Show how holding the power button brings up the menu to turn off or restart.',
          'Locate the volume buttons together — press them up and down while playing a sound so the senior can hear the difference.',
          'Go to Settings → Display → Font Size and increase the text together. Ask the senior what size feels most comfortable.',
          'Celebrate each success — "You just changed your settings! That\'s something lots of people never learn to do."',
          'End by asking the senior to turn the phone off and back on themselves while you watch.',
        ],
      },
      {
        number: 2,
        title: 'Making and Receiving Calls',
        objective: 'Learn how to make a phone call, save a contact, and call someone you\'ve saved.',
        duration: '25 minutes',
        skills: [
          'Open the Phone app and dial a number',
          'Save a contact with a name and phone number',
          'Call a saved contact from your contacts list',
        ],
        teachingGuide: [
          'Open the Phone app together and explain the green call button and red end button.',
          'Dial your own number so they can see it ring — this makes the lesson feel real.',
          'Show how to add a contact: tap the Contacts tab → Add → type in the name and number.',
          'Save the senior\'s family member\'s number together (with their permission).',
          'Practice calling that contact. Walk through what to do if voicemail answers.',
          'Explain that the red button always ends the call — no matter what.',
        ],
      },
      {
        number: 3,
        title: 'Texting and Voice-to-Text',
        objective: 'Learn how to send and receive text messages, and use your voice to type instead of the keyboard.',
        duration: '30 minutes',
        skills: [
          'Open Messages and send a text to a saved contact',
          'Read and reply to a text message you receive',
          'Use voice-to-text to send a message without typing',
        ],
        teachingGuide: [
          'Open the Messages app together. Show how to find a conversation and open it.',
          'Tap the new message button and search for the contact you saved last session.',
          'Type a short message together — "Hello, this is [name]. Just learning to text!"',
          'Have the teen send a reply so the senior can see what a received message looks like.',
          'Show the microphone icon on the keyboard — tap it and speak a message.',
          'Practice until the senior feels confident. Remind them: mistakes in texts are fine, everyone makes them.',
        ],
      },
    ],
  },
  {
    id: 'video-calling',
    title: 'Video Calling Family',
    icon: 'video',
    color: 'purple',
    description: 'Connect face-to-face with family anywhere in the world using free video calling apps.',
    sessions: [
      {
        number: 1,
        title: 'What Is a Video Call?',
        objective: 'Understand what video calling is, why it\'s useful, and get the right app installed on your phone.',
        duration: '20 minutes',
        skills: [
          'Explain what a video call is in your own words',
          'Identify which video app your family uses (WhatsApp or FaceTime)',
          'Download and open the app successfully',
        ],
        teachingGuide: [
          'Start with the why: "A video call lets you see and hear the person at the same time, like being in the same room."',
          'Ask what device the senior\'s family members use — iPhone users have FaceTime built in, everyone else can use WhatsApp.',
          'If WhatsApp is needed: open the App Store or Play Store, search "WhatsApp," tap Install.',
          'Walk through the WhatsApp setup together — verifying their phone number with the code.',
          'Show what the app looks like when open. Don\'t make the call yet — just explore together.',
          'End with: "Next session, we\'re going to make your first video call."',
        ],
      },
      {
        number: 2,
        title: 'Your First Video Call',
        objective: 'Make a real video call with the teen\'s help, and learn to answer incoming calls.',
        duration: '30 minutes',
        skills: [
          'Start a video call from WhatsApp or FaceTime',
          'Answer an incoming video call',
          'End a video call using the red button',
        ],
        teachingGuide: [
          'Start the session by making a video call between your own device and the senior\'s phone.',
          'Walk through the steps together: open WhatsApp → tap the senior\'s contact → tap the video camera icon.',
          'Once connected, show them what the screen looks like — their face in the small box, yours in the big one.',
          'Hang up and call them again so they can practice answering.',
          'Discuss camera tips: hold the phone at eye level, make sure there\'s light in front of you, not behind.',
          'If the senior wants to call a family member right now, offer to stay nearby as they do it.',
        ],
      },
      {
        number: 3,
        title: 'Scheduling Calls and Fixing Problems',
        objective: 'Learn how to plan a video call with family in advance and what to do if something goes wrong.',
        duration: '25 minutes',
        skills: [
          'Explain how to tell family what time to expect your call',
          'Identify three common video call problems and how to fix them',
          'Successfully make a solo video call without guidance',
        ],
        teachingGuide: [
          'Explain that scheduling means letting family know in advance — "I\'ll call you Sunday at 3pm."',
          'Show how to send a text saying when you\'ll call.',
          'Walk through common problems: "I can\'t hear them" (check volume), "They can\'t see me" (check camera permission), "It keeps dropping" (check WiFi).',
          'For camera permission: Settings → Apps → WhatsApp → Permissions → Camera → Allow.',
          'Have the senior make a full practice call on their own while you watch quietly.',
          'Celebrate the milestone: they can now call family face-to-face from anywhere.',
        ],
      },
    ],
  },
  {
    id: 'safe-browsing',
    title: 'Safe Browsing',
    icon: 'shield',
    color: 'green',
    description: 'Navigate the internet confidently while staying protected from scams and dangerous websites.',
    sessions: [
      {
        number: 1,
        title: 'The Internet, Browsers, and Websites',
        objective: 'Understand what the internet and a browser are, and learn how to navigate to a website by typing its address.',
        duration: '25 minutes',
        skills: [
          'Explain the difference between the internet and a browser',
          'Type a web address and go to that website',
          'Use the back button to return to a previous page',
        ],
        teachingGuide: [
          'Start simply: "The internet is like a giant library. A browser is the door you use to walk in."',
          'Open Chrome or Safari together. Point out the address bar at the top.',
          'Type a familiar address together: www.weather.gov or a local news site.',
          'Show what happens when you press Go/Enter — the page loads.',
          'Practice the back button — tap it a few times to show how you retrace your steps.',
          'End by having the senior type an address themselves and arrive at the right page.',
        ],
      },
      {
        number: 2,
        title: 'Recognizing Safe Websites',
        objective: 'Learn to tell the difference between safe and dangerous websites before clicking anything.',
        duration: '30 minutes',
        skills: [
          'Spot the padlock icon and https:// that show a site is secure',
          'Recognize three warning signs of a suspicious website',
          'Close a suspicious website or pop-up immediately',
        ],
        teachingGuide: [
          'Show the padlock icon in the browser address bar on a secure site like medicare.gov.',
          'Explain https: "The \'s\' stands for secure — your information travels in a locked box."',
          'Show examples of suspicious site warning signs: misspelled URLs, lots of pop-ups, "You\'ve won!" banners.',
          'Demonstrate closing a pop-up: tap the X, and if that doesn\'t work, close the whole tab.',
          'Practice together: look at 3 websites and decide together if each seems safe.',
          'Remind them: "If something feels wrong, it\'s okay to just close it. You can\'t break anything."',
        ],
      },
      {
        number: 3,
        title: 'Passwords and Protecting Your Information',
        objective: 'Create a strong password and understand what personal information to never share online.',
        duration: '30 minutes',
        skills: [
          'Create a strong password using a memorable phrase',
          'Name three pieces of information never to share online',
          'Recognize what a legitimate website will and won\'t ask for',
        ],
        teachingGuide: [
          'Explain that a strong password is long, not complicated: "MyDogLovesWalks2019!" is very strong.',
          'Help create a practice password using a personal phrase they\'ll remember.',
          'Discuss the never-share list: Social Security number, bank account details, Medicare ID, full date of birth.',
          'Explain that real banks and government sites never ask for passwords over email or phone.',
          'Show what a legitimate login page looks like vs. a phishing page.',
          'End with the golden rule: "When in doubt, close it out. Then call the real organization directly."',
        ],
      },
    ],
  },
  {
    id: 'understanding-ai',
    title: 'Understanding AI Tools',
    icon: 'sparkles',
    color: 'amber',
    description: 'Explore artificial intelligence tools like ChatGPT and Claude and what they can do and when to be careful.',
    sessions: [
      {
        number: 1,
        title: 'What Is AI?',
        objective: 'Understand what artificial intelligence is, what tools like ChatGPT and Claude are, and what kinds of questions you can ask them.',
        duration: '25 minutes',
        skills: [
          'Explain AI in your own words',
          'Name at least two AI tools and what they\'re used for',
          'Think of a question you\'d like to ask an AI',
        ],
        teachingGuide: [
          'Start with a relatable comparison: "AI is like a very well-read assistant that has read billions of pages — but it\'s not human and it doesn\'t actually understand things the way we do."',
          'Name the main tools: ChatGPT (by OpenAI), Claude (by Anthropic), Gemini (by Google).',
          'Explain what you can ask: recipes, explanations of medical terms, help writing a letter, travel ideas.',
          'Ask the senior what they know well from their career — they\'ll soon be the expert testing the AI.',
          'Show the AI interface without asking anything yet. Let the senior look at it.',
          'End: "Next session we\'re going to have a real conversation with it together."',
        ],
      },
      {
        number: 2,
        title: 'Having a Conversation with AI',
        objective: 'Ask an AI tool a real question about something you know well, and evaluate how good its answer is.',
        duration: '30 minutes',
        skills: [
          'Type or speak a question to an AI tool',
          'Read and evaluate the AI\'s response',
          'Ask a follow-up question to get a better answer',
        ],
        teachingGuide: [
          'Open Claude.ai or ChatGPT together.',
          'Let the senior choose the topic — ideally something from their career. "Ask it something about farming" or "Ask it about accounting."',
          'Type the question together. Read the answer together.',
          'Discuss: "Is this accurate? Does anything seem off?" The senior is the expert here.',
          'Show how to ask a follow-up: "Tell me more about..." or "Can you explain that more simply?"',
          'Switch roles — teen explains something they know, senior evaluates whether the AI explains it well.',
        ],
      },
      {
        number: 3,
        title: 'When to Trust AI and When Not To',
        objective: 'Understand the real limitations of AI, and learn how scammers use AI to deceive people.',
        duration: '30 minutes',
        skills: [
          'Name two situations where AI can be wrong or misleading',
          'Recognize signs that a voice or video may be AI-generated',
          'Know what to do if you receive suspicious AI-generated content',
        ],
        teachingGuide: [
          'Explain AI hallucination: "Sometimes AI makes up facts that sound completely real. This is called hallucinating."',
          'Demonstrate: ask AI about a very specific local fact and verify it together.',
          'Explain deepfakes: AI can now create fake voices and videos of real people.',
          'Discuss scam scenarios: a fake voice call from "your grandchild" asking for emergency money.',
          'Golden rule: if someone calls asking for money urgently, hang up and call them back on a number you know.',
          'End positively: AI is a useful tool when you stay informed about its limits.',
        ],
      },
    ],
  },
  {
    id: 'gov-health-portals',
    title: 'Government and Health Portals',
    icon: 'building',
    color: 'teal',
    description: 'Access important government and healthcare services online safely and with confidence.',
    sessions: [
      {
        number: 1,
        title: 'Finding Your Government Website',
        objective: 'Locate your local government\'s official website and find the contact information you need.',
        duration: '25 minutes',
        skills: [
          'Find your city or county government website',
          'Locate a phone number or contact form on the site',
          'Bookmark the site for easy access later',
        ],
        teachingGuide: [
          'Start with: "Government websites always end in .gov — that\'s how you know they\'re official."',
          'Search together for [city name] city government — show how to spot the real site vs. copycat sites.',
          'Navigate to the "Contact Us" page together.',
          'Show how to bookmark a page: tap the star icon in the browser address bar.',
          'Practice locating two pieces of information: the city hall hours and a service phone number.',
          'Remind them: official sites will never ask for your Social Security number just to browse.',
        ],
      },
      {
        number: 2,
        title: 'Booking a Medical Appointment Online',
        objective: 'Successfully navigate a patient portal or clinic website to book a medical appointment.',
        duration: '30 minutes',
        skills: [
          'Find the appointment booking section of a clinic or hospital website',
          'Create or log into a patient portal account',
          'Complete an appointment request or booking form',
        ],
        teachingGuide: [
          'Use the senior\'s actual doctor\'s office website or a well-known local hospital.',
          'Navigate to the patient portal link together.',
          'If they don\'t have an account: walk through the registration process (name, date of birth, email).',
          'Locate the "Request an Appointment" or "Book Online" section.',
          'Fill out the form together: reason for visit, preferred time, doctor preference.',
          'Show the confirmation email they\'ll receive and explain what to do with it.',
        ],
      },
      {
        number: 3,
        title: 'Medicare and Social Security Online',
        objective: 'Understand what you can safely do on official Medicare and Social Security websites.',
        duration: '30 minutes',
        skills: [
          'Navigate to Medicare.gov and find your plan information',
          'Understand three things you can do safely on ssa.gov',
          'Identify the warning signs of a fake government website',
        ],
        teachingGuide: [
          'Go to Medicare.gov together — show it ends in .gov and has the padlock.',
          'Explore: finding local doctors that accept Medicare, checking coverage, finding contact numbers.',
          'Go to ssa.gov — show the my Social Security account portal.',
          'Explain what you can do: check your earnings record, estimate future benefits, update your address.',
          'Discuss what the real sites will NEVER do: call you asking for payment, demand immediate action.',
          'End with a summary card: "If in doubt, call 1-800-MEDICARE or 1-800-772-1213 directly."',
        ],
      },
    ],
  },
]

export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const DIFFICULTY_LABELS = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Moderate',
  4: 'Advanced',
  5: 'Expert',
}

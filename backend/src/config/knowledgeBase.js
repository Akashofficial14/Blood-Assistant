const knowledgeBase = [
  {
    id: 1,
    topic: "login",
    keywords: ["login", "sign in", "account", "register", "signup", "log in"],
    content: `To login to Blood Assistant:
1. Click the 'Login' button on the top right of the homepage.
2. Enter your registered email address and password.
3. Click 'Sign In'.
If you don't have an account, click 'Register' and fill in your name, email, password, blood group, and contact number.
You can also login as a hospital or blood bank with special credentials.`,
  },
  {
    id: 2,
    topic: "donate blood",
    keywords: [
      "donate",
      "donation",
      "give blood",
      "blood donor",
      "how to donate",
    ],
    content: `To donate blood on Blood Assistant:
1. Login to your account.
2. Go to the 'Donate Blood' section from the dashboard or navigation menu.
3. Fill in your details: blood group, location, availability date, and contact number.
4. Submit the form — your profile will be listed as an available donor.
5. Interested recipients or hospitals will contact you directly.
Eligibility: You must be 18-65 years old, weigh at least 50 kg, and be in good health.`,
  },
  {
    id: 3,
    topic: "request blood",
    keywords: [
      "request",
      "need blood",
      "blood request",
      "emergency blood",
      "require blood",
    ],
    content: `To request blood on Blood Assistant:
1. Login to your account.
2. Click 'Request Blood' from the main menu.
3. Fill in the required blood group, quantity (units), patient name, hospital name, and urgency level.
4. Submit — the system will search for matching donors in your area.
5. You will receive contact details of available donors.
For emergencies, mark your request as 'Urgent' to get priority attention.`,
  },
  {
    id: 4,
    topic: "blood types",
    keywords: [
      "blood type",
      "blood group",
      "blood groups",
      "compatible",
      "which blood",
      "A+",
      "B+",
      "O+",
      "AB+",
    ],
    content: `Blood Assistant supports all 8 blood groups:
- A+ (A Positive): Can donate to A+, AB+
- A- (A Negative): Can donate to A+, A-, AB+, AB-
- B+ (B Positive): Can donate to B+, AB+
- B- (B Negative): Can donate to B+, B-, AB+, AB-
- O+ (O Positive): Can donate to A+, B+, O+, AB+
- O- (O Negative): Universal donor — can donate to all blood groups
- AB+ (AB Positive): Universal recipient — can receive from all groups
- AB- (AB Negative): Can donate to AB+, AB-
You can filter donors by blood group in the search section.`,
  },
  {
    id: 5,
    topic: "find blood bank",
    keywords: [
      "blood bank",
      "nearest",
      "near me",
      "find blood",
      "location",
      "where",
      "nearby",
    ],
    content: `To find nearest blood banks:
1. Go to the 'Find Blood Bank' section from the navigation.
2. Allow location access or enter your city/pincode manually.
3. The map will show blood banks near you with their contact details and available blood groups.
4. You can call them directly from the app.
Blood Assistant shows real-time availability from registered blood banks across India.`,
  },
  {
    id: 6,
    topic: "emergency",
    keywords: ["emergency", "urgent", "critical", "immediate", "help", "sos"],
    content: `For blood emergencies:
1. Use the 'Emergency Request' button visible on the homepage (no login required).
2. Enter the required blood group and your location.
3. The system will immediately alert all nearby donors and blood banks.
4. You will see contact details within seconds.
You can also call the National Blood Helpline: 1800-XXX-XXXX (available 24/7).
Mark your request as 'Critical' for the fastest response.`,
  },
  {
    id: 7,
    topic: "check availability",
    keywords: [
      "availability",
      "available",
      "stock",
      "check",
      "units",
      "how much",
    ],
    content: `To check blood availability:
1. Go to 'Search Donors' or 'Blood Availability' from the menu.
2. Select your required blood group and city.
3. The system will show all available donors and blood banks with their current stock.
4. Availability is updated in real-time as donors register and banks update their inventory.`,
  },
  {
    id: 8,
    topic: "about blood assistant",
    keywords: [
      "what is",
      "about",
      "platform",
      "how it works",
      "blood assistant",
      "this website",
      "website",
    ],
    content: `Blood Assistant is a platform that connects blood donors, recipients, and blood banks across India.
Key features:
- Find donors by blood group and location
- Request blood in emergencies
- Register as a donor
- Locate nearby blood banks on a map
- Real-time availability tracking
- Emergency alerts to nearby donors
Our mission is to make blood accessible to anyone who needs it, anytime.`,
  },
  {
    id: 9,
    topic: "profile",
    keywords: [
      "profile",
      "update",
      "edit",
      "my account",
      "change password",
      "settings",
    ],
    content: `To manage your profile:
1. Login and click your name/avatar in the top right corner.
2. Select 'My Profile' or 'Settings'.
3. You can update: name, contact number, blood group, address, and availability status.
4. To change your password, go to Settings > Change Password.
5. You can toggle your donor status ON/OFF from your profile anytime.`,
  },
  {
    id: 10,
    topic: "hospital",
    keywords: [
      "hospital",
      "register hospital",
      "hospital account",
      "medical center",
    ],
    content: `Hospitals can register on Blood Assistant to:
- Post bulk blood requirements
- Access the donor database
- Manage blood bank inventory
- Set up emergency alerts
To register as a hospital, click 'Register as Hospital' on the login page and provide your hospital registration number and documents for verification.`,
  },
];

module.exports = knowledgeBase;

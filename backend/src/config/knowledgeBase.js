const knowledgeBase = [
  {
    id: 1,
    topic: "about blood assistant",
    keywords: [
      "what is",
      "about",
      "platform",
      "how it works",
      "blood assistant",
      "this website",
      "website",
      "features",
      "mission",
    ],
    content: `Blood Assistant is a full-stack blood donation and blood bank management platform that connects blood donors, recipients, and blood banks.

Key features:
1. Find verified blood banks nearby with real-time blood stock.
2. Filter blood banks by blood group, city, and state.
3. Register as a blood donor and schedule a donation appointment.
4. Blood bank owners can register and manage their blood bank.
5. Admins verify and manage blood banks and users.
6. A chatbot is available for Blood Assistant related guidance.

The public website includes Home, Find Blood Banks Nearby, Donate Blood, About Us, Login/Register, and the chatbot.`,
  },
  {
    id: 2,
    topic: "navigation and pages",
    keywords: [
      "pages",
      "navigation",
      "navbar",
      "menu",
      "home",
      "where to go",
      "sections",
    ],
    content: `Main pages in Blood Assistant:
1. Home: landing page with buttons for Locate Nearby and Donor Portal.
2. Find Blood Banks Nearby: shows verified blood banks with filters, stock, and contact details.
3. Donate Blood: lets a logged-in user register and schedule a blood donation appointment.
4. About Us: explains the mission, values, and community focus.
5. Login/Register: lets users sign in, create an account, or continue with Google.
6. User Profile: lets a logged-in user view and edit profile details and update password.`,
  },
  {
    id: 3,
    topic: "account types and roles",
    keywords: [
      "role",
      "roles",
      "account type",
      "user type",
      "find blood",
      "manage bank",
      "admin",
      "which account",
    ],
    content: `Blood Assistant has three account types:
1. Find Blood: normal users who can find blood banks and register a donation appointment.
2. Manage Bank: blood bank owners or managers who can register and manage a blood bank.
3. Admin: system administrators who manage users and verify or reject blood bank registrations.

When registering, you choose either Find Blood or Manage Bank. Google sign-in creates new accounts as Find Blood by default.`,
  },
  {
    id: 4,
    topic: "login",
    keywords: [
      "login",
      "sign in",
      "signin",
      "log in",
      "account",
      "password",
      "how to login",
    ],
    content: `To log in to Blood Assistant:
1. Open the Login page.
2. Enter your email address and password.
3. Click Sign In.

After login, you are redirected based on your account type:
1. Find Blood users go to the home page.
2. Manage Bank users go to the blood bank dashboard if their bank is registered, otherwise they go to the registration form.
3. Admin users go to the admin dashboard.`,
  },
  {
    id: 5,
    topic: "register account",
    keywords: [
      "register",
      "signup",
      "sign up",
      "create account",
      "new account",
      "join",
      "how to register",
    ],
    content: `To create a Blood Assistant account:
1. Open the Login page and switch to Sign Up.
2. Choose your account type: Find Blood or Manage Bank.
3. Enter your full name, email, and password.
4. Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol.
5. Submit the form.

Duplicate email addresses are not allowed. Each email can only have one account.`,
  },
  {
    id: 6,
    topic: "google sign in",
    keywords: [
      "google",
      "google login",
      "continue with google",
      "social login",
      "google sign in",
      "sign in with google",
    ],
    content: `Blood Assistant supports Google sign-in.

How to use Google sign-in:
1. Click Sign in with Google on the Login page.
2. Google will ask you to select or confirm your account.
3. After Google authenticates you, you are redirected back to Blood Assistant.
4. New accounts created through Google are set as Find Blood by default.
5. If you already have an account, your existing role is kept and your account is marked verified.`,
  },
  {
    id: 7,
    topic: "logout",
    keywords: [
      "logout",
      "log out",
      "sign out",
      "exit",
      "end session",
      "how to logout",
    ],
    content: `To log out from Blood Assistant:
1. Use the profile or logout button in the navbar or dashboard.
2. Your session will be cleared.
3. You will be redirected to the Login page.`,
  },
  {
    id: 8,
    topic: "forgot password",
    keywords: [
      "forgot password",
      "forget password",
      "reset password",
      "password reset",
      "lost password",
      "can't login",
    ],
    content: `To reset your password:
1. On the Login page, click Forgot password.
2. Enter your registered email address.
3. A password reset link will be sent to your email.
4. Open the link from your email.
5. Enter your new password and submit.

Logged-in users can also change their password directly from the User Profile page.`,
  },
  {
    id: 9,
    topic: "user profile",
    keywords: [
      "profile",
      "my profile",
      "edit profile",
      "update profile",
      "change name",
      "personal information",
      "account settings",
    ],
    content: `User Profile lets you view and manage your account details.

Available actions:
1. View your name and email.
2. Edit your full name.
3. Change your password by entering your current password and a new password.

To access your profile, use the profile option in the navbar after logging in.`,
  },
  {
    id: 10,
    topic: "find blood banks",
    keywords: [
      "find blood bank",
      "blood banks nearby",
      "nearby",
      "search bank",
      "search blood",
      "blood bank",
      "verified centers",
      "locate blood bank",
    ],
    content: `To find blood banks:
1. Open Find Blood Banks Nearby from the navbar or click Locate Nearby on the Home page.
2. The page shows all verified blood banks.
3. Search by blood bank name, city, or state.
4. Filter by state and city.
5. Filter by blood group: All, A+, A-, B+, B-, O+, O-, AB+, or AB-.
6. Sort by name or stock.
7. Click a blood bank card to see full details.

Each card shows name, city, state, phone, organization type, 24/7 status, and blood stock. Only verified blood banks are shown.`,
  },
  {
    id: 11,
    topic: "blood bank details",
    keywords: [
      "bank details",
      "blood bank details",
      "contact bank",
      "call bank",
      "stock details",
      "bank information",
      "emergency contact",
      "timings",
    ],
    content: `When you click a blood bank card, you can see:
1. Blood bank name.
2. Address, city, and state.
3. Phone number.
4. Email address.
5. Timings and whether it is open 24/7.
6. Organization type.
7. License number.
8. Emergency contact.
9. Full blood stock for all blood groups.
10. A Register to Donate button.
11. A Call button if a phone number is available.`,
  },
  {
    id: 12,
    topic: "nearby blood bank search",
    keywords: [
      "near me",
      "nearby",
      "location",
      "radius",
      "distance",
      "close to me",
      "blood bank near me",
    ],
    content: `Blood Assistant can find blood banks near your location.

How nearby search works:
1. Allow location access when prompted, or enter your location manually.
2. The app searches for verified blood banks within a default radius of 10 km.
3. You can filter by blood group to find banks that have available stock for a specific group.
4. Results are sorted by nearest distance first.
5. Only verified blood banks with stock greater than 0 for the selected group are shown when filtering by blood group.`,
  },
  {
    id: 13,
    topic: "blood groups",
    keywords: [
      "blood group",
      "blood type",
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
      "compatible",
      "compatibility",
      "which blood group",
    ],
    content: `Blood Assistant supports all 8 blood groups:
1. A+
2. A-
3. B+
4. B-
5. AB+
6. AB-
7. O+
8. O-

You can filter blood banks by blood group availability on the Find Blood Banks Nearby page. Donor registration forms also use these same groups.`,
  },
  {
    id: 14,
    topic: "check blood availability",
    keywords: [
      "availability",
      "available",
      "stock",
      "units",
      "blood units",
      "check availability",
      "inventory",
      "low stock",
      "how much blood",
    ],
    content: `To check blood availability:
1. Open Find Blood Banks Nearby.
2. Select the needed blood group from the filter row.
3. Only banks with available units for that group will be shown.
4. Each card shows a stock status such as Available, Low Stock, Unavailable, or the number of units.
5. Open a blood bank card to see full stock details for all blood groups.`,
  },
  {
    id: 15,
    topic: "donate blood",
    keywords: [
      "donate",
      "donation",
      "give blood",
      "become donor",
      "donor portal",
      "register donor",
      "schedule donation",
      "how to donate",
    ],
    content: `To register as a donor and schedule a donation:
1. Log in to your account first.
2. Open Donate Blood from the navbar or click Donor Portal on the Home page.
3. Enter your full name, blood group, and gender.
4. Select state, city, and a verified blood bank.
5. Choose your preferred date and time slot.
6. Enter your phone number and email.
7. Click Register & Schedule.

Your appointment will be registered with the selected blood bank.`,
  },
  {
    id: 16,
    topic: "donor eligibility",
    keywords: [
      "eligibility",
      "eligible",
      "requirements",
      "age",
      "weight",
      "can i donate",
      "donor checklist",
      "who can donate",
    ],
    content: `Donor requirements shown on the Donate Blood page:
1. You must be 18 to 65 years old.
2. You must weigh more than 50 kg.
3. You must not have had surgery in the last 6 months.
4. You must have a valid government ID.

Medical eligibility is always confirmed by the blood bank or medical staff before the donation takes place.`,
  },
  {
    id: 17,
    topic: "request blood or need blood urgently",
    keywords: [
      "request blood",
      "need blood",
      "urgent blood",
      "emergency blood",
      "critical",
      "patient",
      "blood request",
      "require blood",
      "how to get blood",
    ],
    content: `If you need blood urgently, follow these steps:
1. Open Find Blood Banks Nearby.
2. Filter by the required blood group.
3. Use city or state filter to find banks close to you.
4. Open a verified blood bank card.
5. Call the phone number or emergency contact listed in the details.

For a medical emergency, also contact your local emergency medical services or the hospital handling the patient.`,
  },
  {
    id: 18,
    topic: "emergency help",
    keywords: [
      "emergency",
      "urgent",
      "critical",
      "sos",
      "immediate help",
      "life saving",
      "help now",
    ],
    content: `For an emergency blood need:
1. Open Find Blood Banks Nearby from the home page.
2. Select the required blood group.
3. Search by city or state to narrow results.
4. Open a verified blood bank and call the phone or emergency contact shown.

For urgent medical cases, also contact your local emergency services or the hospital directly.`,
  },
  {
    id: 19,
    topic: "blood bank owner dashboard",
    keywords: [
      "owner",
      "manage bank",
      "blood bank owner",
      "owner dashboard",
      "bank panel",
      "manage blood bank",
    ],
    content: `Blood bank owners access a dedicated dashboard after logging in with a Manage Bank account.

Dashboard sections:
1. Dashboard: summary of total blood units, low stock count, and inventory status by blood group.
2. Inventory: add or update blood units for each blood group.
3. Donor Requests: view all donor appointment registrations for your blood bank.
4. Profile: view and edit your blood bank contact, location, and operational details.`,
  },
  {
    id: 20,
    topic: "register blood bank",
    keywords: [
      "register blood bank",
      "blood bank registration",
      "bank registration",
      "add blood bank",
      "new blood bank",
      "how to register blood bank",
    ],
    content: `To register your blood bank on Blood Assistant:
1. Sign up or log in with a Manage Bank account.
2. If your bank is not yet registered, you will be taken to the registration form.
3. Complete the multi-step form.

Registration steps:
1. Basic Info: blood bank name and organization type.
2. License: license number, validity date, and license document URL.
3. Contact: email, phone, emergency contact, and website.
4. Address: street, landmark, city, state, zip code, and map location.

You can autofill city and state by entering your 6-digit pincode. Location can also be detected automatically through your browser. A map location is required before submitting.`,
  },
  {
    id: 21,
    topic: "blood bank verification",
    keywords: [
      "verification",
      "pending",
      "verified",
      "rejected",
      "approval",
      "admin approval",
      "bank status",
      "how long verification",
    ],
    content: `After registering your blood bank, it goes through admin review.

Verification statuses:
1. Pending: submitted and waiting for admin review.
2. Verified: approved by admin and visible to users searching for blood banks.
3. Rejected: not approved by admin.

Your blood bank is only visible to users once it is verified. You can check your verification status from your owner dashboard Profile section.`,
  },
  {
    id: 22,
    topic: "owner inventory management",
    keywords: [
      "inventory",
      "update inventory",
      "add blood",
      "update units",
      "blood units",
      "low stock",
      "manage inventory",
    ],
    content: `Blood bank owners can manage blood inventory from the Inventory section.

How to update inventory:
1. Go to the Inventory section in your dashboard.
2. View all blood groups and their current unit counts.
3. Click a blood group card to update its units.
4. Or use Add Blood to select a group and enter the new unit count.
5. Units cannot be negative.
6. Supported groups are A+, A-, B+, B-, AB+, AB-, O+, and O-.`,
  },
  {
    id: 23,
    topic: "owner donor requests",
    keywords: [
      "donor requests",
      "donor management",
      "appointment",
      "registered donors",
      "view donors",
      "donation appointments",
    ],
    content: `Blood bank owners can view all donor registrations in the Donor Requests section.

Each donor entry shows:
1. Donor full name.
2. Blood group.
3. Phone and email.
4. Preferred appointment date.
5. Preferred time slot.

You can accept or decline appointments from this section.`,
  },
  {
    id: 24,
    topic: "owner blood bank profile",
    keywords: [
      "blood bank profile",
      "edit bank",
      "update bank details",
      "bank contact",
      "open 24/7",
      "bank information",
    ],
    content: `Blood bank owners can view and edit their bank profile in the Profile section.

Profile shows:
1. Bank name and organization type.
2. Verification status.
3. License number and validity date.
4. Open 24/7 setting.
5. Contact email, phone, emergency contact, and website.
6. City and state.

You can update contact details, address, and the Open 24/7 setting. Bank name, organization type, and verification status cannot be changed through the profile.`,
  },
  {
    id: 25,
    topic: "admin dashboard",
    keywords: [
      "admin",
      "admin dashboard",
      "admin panel",
      "system admin",
      "admin sections",
    ],
    content: `The admin dashboard has four sections:
1. Dashboard: view and manage all verified blood bank facilities.
2. Requests: review blood bank verification requests grouped by pending, verified, or rejected status.
3. Users: view registered users and manage their account roles.
4. Profile: update admin profile and change password.

The admin dashboard is only accessible to admin accounts.`,
  },
  {
    id: 26,
    topic: "admin blood bank management",
    keywords: [
      "verify bank",
      "reject bank",
      "remove bank",
      "approve bank",
      "admin requests",
      "blood bank approval",
    ],
    content: `Admins review and manage blood bank registrations.

Admin actions for blood bank requests:
1. View blood banks grouped by pending, verified, or rejected.
2. Review bank name, city, state, contact, organization type, license, and documents.
3. Approve a pending blood bank to make it visible to users.
4. Reject a pending blood bank.

Admin actions for verified facilities:
1. View all verified blood banks.
2. Search by name or city.
3. Remove a verified blood bank from the platform.`,
  },
  {
    id: 27,
    topic: "admin user management",
    keywords: [
      "users",
      "user management",
      "change role",
      "user roles",
      "manage users",
      "admin users",
    ],
    content: `Admins can manage users in the Users section.

User management features:
1. View all verified users.
2. Search users by name.
3. Select one or multiple users.
4. Reveal or hide user email addresses.
5. Change selected users to admin or Find Blood role using the role update option.`,
  },
  {
    id: 28,
    topic: "admin profile",
    keywords: [
      "admin profile",
      "admin account settings",
      "admin password",
      "update admin profile",
    ],
    content: `Admins can manage their account from the Profile section.

Admin profile features:
1. View name, email, and System Administrator label.
2. Edit profile name and email.
3. Change password through the Change Password option.`,
  },
  {
    id: 29,
    topic: "chatbot",
    keywords: [
      "chatbot",
      "chat bot",
      "assistant",
      "ai",
      "suggested questions",
      "help chatbot",
      "chat",
    ],
    content: `Blood Assistant includes a chatbot to help you with platform-related questions.

How to use the chatbot:
1. Click the chat button near the bottom-right of the page.
2. Type your question or pick from the suggested questions.
3. Suggested questions include How to donate blood, Find blood near me, Emergency help, and Check availability.
4. The chatbot answers questions about Blood Assistant features, navigation, and how to use the platform.

The chatbot only answers questions related to Blood Assistant. For unrelated topics, it will let you know it can only help with Blood Assistant questions.`,
  },
];

module.exports = knowledgeBase;
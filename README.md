Freedom_app
This project is a mobile-first social media web application.

Project structure:

my-social-app/
├── node_modules/
├── public/
│   ├── logo.png                # Site logo
│   └── favicon.ico             # Browser tab icon
│
├── src/
│   ├── assets/
│   │   ├── icons/              # Icons for Profile, Notifications, Messages
│   │   │   ├── profile.svg
│   │   │   ├── notification.svg
│   │   │   └── message.svg
│   │   └── images/             # Placeholder or sample post images
│   │
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.js       # Top-left logo only
│   │   │
│   │   ├── BottomNav/
│   │   │   └── BottomNav.js    # Profile, Notifications, Messages
│   │   │
│   │   ├── Post/
│   │   │   ├── TextPost.js
│   │   │   └── ImagePost.js
│   │   │
│   │   ├── ProfileDropdown/    # Optional: dropdown inside Profile page
│   │   │   └── ProfileDropdown.js
│   │   │
│   │   └── MessageList/
│   │       └── MessageList.js
│   │
│   ├── pages/
│   │   ├── Login/
│   │   │   └── Login.js
│   │   │
│   │   ├── Signup/
│   │   │   └── Signup.js
│   │   │
│   │   ├── Home/
│   │   │   └── Home.js         # Feed + Header + BottomNav
│   │   │
│   │   ├── Profile/
│   │   │   └── Profile.js      # User posts, followers, followings, points
│   │   │
│   │   ├── Notifications/
│   │   │   └── Notifications.js # Likes, comments, follows
│   │   │
│   │   └── Messages/
│   │       └── Messages.js      # Chat list + messages
│   │
│   ├── services/
│   │   ├── authService.js      # Login/signup API calls
│   │   ├── postService.js      # Fetch/create posts API calls
│   │   ├── userService.js      # Followers, points, profile API calls
│   │   └── messageService.js   # Messages API calls
│   │
│   ├── contexts/
│   │   └── UserContext.js      # User state, login info, notifications
│   │
│   ├── utils/
│   │   ├── validators.js       # Username/password checks
│   │   └── pointsCalculator.js # Profile points logic
│   │
│   ├── App.js                   # Main app with routes
│   ├── index.js                 # Entry point
│   └── routes.js                # Central route definitions
├── package-lock.json
├── package.json
├── .gitignore
└── README.md

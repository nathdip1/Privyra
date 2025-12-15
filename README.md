Hey I am developing a website using react and javascript.
My app name is Privyra. I'm giving you the basic idea of the features of my site.

1.There's no email or mobile is required to login. User can simply choose a username and password to signup and then can login using the chosen username and password. Then in the homepage there is a form where user can upload a image and that image is become encrypted and stored in Mongodb in encrypted form. 
2.At the time of upload user has 2 options. One is user can set a time in minutes for how much time the link will be active. Second is user can set the number of views. If suppose user sets max view 3 then after viewing the image 3 times the link will be deactivated. I also have a feature to add watermark. Basically at the time of uploading the image user can add some text(whatever they want). 
3.Then a link is generated. That link has the encrypted key. Under the link box there are 2 options: one is copy button and second is share button.
4.Then user can either see the uploaded image by pasting that link in the box below and then click the display image or user can share the image to anyone. So the other person can see the image pasting the link in the box and clicking Display image button. Now is the uploader set a time then after the setting time the link will be deactivated. Likewise is uploader set max view then after that numbers of viewing the link will be deactivated. When viewing the image the watermark should be automatically appear in the image in diagonally at least 3 lines along with my default watermark 'Privyra'. Suppose uploader added watermark 'Sending this image to xyz' then the full watermark in the image should be 'Privyra: Sending this image to xyz'. I have an issue with the share button and watermark option as of now. I will explain later.
5.I have a profile option at top right corner of the site. Basically in header bar. This header bar is fixed. This bar doesn't move upon scrolling the site. Profile is a dropdown menu and as of now I have Dashboard and Logout button.
6.In Dashboard I am giving the uploader a page to see total no of active link, total no of inactive link, and Total no of uploads. And there is a list of links that uploader has generated links. And if uploader wants then uploader can revoke the link anytime even before the link expires. This page has some issues I will explain later.

Now a few things about my project.
1.The site should be concerned about user's privacy.
2.The site is zero knowledge platform where even as a developer and admin of the database I can't see the image uploaded by the user.
3.End to end encryption is the most important thing in my platform.
4.User should not take screenshot in PC and mobile, can't download the image, can't right click or if right click in the image then the download or screenshot option should not be in the right click menu.
5.Automatically blur upon opening another app or switch between apps in PC(not sure in mobile). This feature I already have.
7.The site should be mobile friendly(most important because my audience will be 99% mobile user).

Now I'm giving you my project structure tree. Some of the files are not used now. But I'm giving you the whole project structure tree to remember the files. So when I'll ask you for any issues and for that whatever the updates I need to make in the existing file then you should tell me and also is I need to create any new files then also you have to tell me. Then always remember whenever you give me any update then first ask my existing code then decide what should be the files then always give me full updated code. If you need to see more that one file's existing code then please do that and then take decision. Remember DO NOT BREAK THE EXISTING SETUP unless I ask you or take my permission before doing that. Specially the frontend UI design and Buttons and all.

Here is the project structure tree:
Privyra:
│   .gitignore
│   README.md
│
├───Client
│   │   .gitignore
│   │   package-lock.json
│   │   package.json
│   │   README.md
│   │
│   ├───public
│   │       avatar.png
│   │       index.html
│   │       logo.png
│   │
│   └───src
│       │   App.js
│       │   index.js
│       │   routes.js
│       │
│       ├───api
│       │       axios.js
│       │
│       ├───assets
│       │   ├───icons
│       │   └───images
│       ├───components
│       │       DisplayImage.js
│       │       Header.js
│       │       Layout.js
│       │       Loader.js
│       │       ProtectedRoute.js
│       │       SecureLinkBox.js
│       │       ShareLogCard.js
│       │       StopShareButton.js
│       │       UploadBox.js
│       │
│       ├───context
│       │       AuthContext.js
│       │       UserContext.js
│       │
│       ├───crypto
│       │       decrypt.js
│       │       encrypt.js
│       │
│       ├───pages
│       │   ├───Dashboard
│       │   │       Dashboard.js
│       │   │
│       │   ├───Home
│       │   │       Home.js
│       │   │
│       │   ├───Login
│       │   │       Login.js
│       │   │
│       │   ├───Messages
│       │   │       Messages.js
│       │   │
│       │   ├───Notifications
│       │   │       Notifications.js
│       │   │
│       │   ├───Profile
│       │   │       Profile.js
│       │   │
│       │   ├───Signup
│       │   │       Signup.js
│       │   │
│       │   ├───Terms
│       │   │       Terms.js
│       │   │
│       │   └───View
│       │           ViewImage.js
│       │
│       ├───services
│       │       authService.js
│       │       shareService.js
│       │       uploadService.js
│       │       viewService.js
│       │
│       ├───styles
│       │       auth.css
│       │       dashboard.css
│       │       global.css
│       │       header.css
│       │       home.css
│       │
│       └───utils
│               api.js
│               pointsCalculator.js
│               validators.js
│
└───Server
    │   .env
    │   package-lock.json
    │   package.json
    │   README.md
    │
    ├───src
    │   │   server.js
    │   │
    │   ├───config
    │   │       cloudinary.js
    │   │       db.js
    │   │
    │   ├───controllers
    │   │       auth.controller.js
    │   │       dashboard.controller.js
    │   │       image.controller.js
    │   │       share.controller.js
    │   │       upload.controller.js
    │   │       view.controller.js
    │   │
    │   ├───middlewares
    │   │       authMiddleware.js
    │   │       expiryCheck.js
    │   │       rateLimiter.js
    │   │
    │   ├───models
    │   │       Image.js
    │   │       upload.model.js
    │   │       User.js
    │   │
    │   ├───routes
    │   │       auth.routes.js
    │   │       dashboard.routes.js
    │   │       image.routes.js
    │   │       share.routes.js
    │   │       upload.routes.js
    │   │       view.routes.js
    │   │
    │   └───utils
    │           gridfs.js
    │           hash.js
    │
    └───uploads

Once you read all these and understand my app and the requirements then I will ask you my existing problem or any feature that I want to build.



---------------------------------------------------------------------------------




go through it and understand it carefully and thouroughly. I will ask you to update the features one by one. Each time you have to give me updated code without breaking existing setup(both frontend and whatever linked with the backend). And anytime if you think that my asking feature needs other file updation then ask me for full code for that particular file and before giving me full code you have to see the existing code for that particular file.
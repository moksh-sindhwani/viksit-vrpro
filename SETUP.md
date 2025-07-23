# ViksitVR - Setup Guide

## 🚀 Quick Start

### Option 1: Direct Use (Recommended for Demo)
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/viksit-vr-education-platform.git
   cd viksit-vr-education-platform
   ```

2. **Open index.html** in your web browser
   ```bash
   # Option A: Double-click index.html
   # Option B: Use a local server (recommended)
   npx http-server . -p 8080
   ```

3. **For video conferencing features:**
   ```bash
   cd quickmeet-master
   npm install
   npm start
   ```

### Option 2: Full Development Setup

1. **Prerequisites**
   - Node.js (v14 or higher)
   - Git
   - Modern web browser (Chrome, Firefox, Safari, Edge)
   - VR headset (optional)

2. **Installation**
   ```bash
   git clone https://github.com/yourusername/viksit-vr-education-platform.git
   cd viksit-vr-education-platform
   npm run install-deps
   ```

3. **Development**
   ```bash
   # Start the video conferencing server
   npm start
   
   # Or start in development mode
   npm run dev
   
   # Serve the main application
   npm run serve
   ```

## 📁 Project Structure

```
ViksitVR/
├── 🏠 index.html              # Main landing page
├── 🎓 viksitVR.html          # Student VR experience  
├── 👩‍🏫 teacher-portal.html   # Teacher dashboard
├── 📝 test.html              # Assessment module
├── 📞 contact.html           # Contact page
├── 🎨 style.css              # Main styles
├── 📱 responsive.css         # Mobile styles
├── ⚡ app.js                 # Main application logic
├── 📦 package.json           # Project dependencies
├── 🎥 quickmeet-master/      # Video conferencing
│   ├── server.js            # Socket.IO server
│   ├── package.json         # Server dependencies
│   └── public/              # Client assets
├── 🖼️ Apple vision canvas images/ # VR assets
├── 📚 README.md              # Project documentation
├── 🛠️ SETUP.md               # This setup guide
├── 🤝 CONTRIBUTING.md        # Contribution guidelines
└── 📄 LICENSE                # MIT License
```

## 🌐 Features Overview

### 🎓 Student Features
- **VR Learning Modules**: Immersive educational experiences
- **Progress Tracking**: Monitor learning journey
- **AI Assistant**: 24/7 doubt resolution
- **Interactive Tests**: Gamified assessments
- **Multilingual Support**: Learn in native language

### 👩‍🏫 Teacher Features  
- **Teacher Portal**: Comprehensive dashboard
- **Student Analytics**: Track progress and engagement
- **Content Management**: Create VR modules
- **Live Classes**: Conduct VR sessions

### 🎥 Communication Features
- **Video Conferencing**: One-on-one doubt sessions
- **Real-time Chat**: Instant messaging
- **Screen Sharing**: Share educational content
- **Room Creation**: Custom meeting rooms

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
CHATBASE_API_KEY=your_chatbase_key
```

### VR Configuration
For optimal VR experience:
1. **Enable WebXR** in your browser
2. **Connect VR headset** (Oculus, HTC Vive, etc.)
3. **Allow camera/microphone** permissions
4. **Use HTTPS** for production deployment

## 🚀 Deployment

### GitHub Pages (Automatic)
1. Push to `main` branch
2. GitHub Actions will automatically deploy
3. Access at: `https://yourusername.github.io/viksit-vr-education-platform`

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred hosting
# (Netlify, Vercel, Firebase, etc.)
```

## 🐛 Troubleshooting

### Common Issues

**1. Video conferencing not working**
```bash
cd quickmeet-master
npm install
npm start
```

**2. VR features not loading**
- Ensure HTTPS connection
- Check browser VR support
- Verify WebXR permissions

**3. AI chatbot not responding**
- Check internet connection
- Verify Chatbase integration
- Clear browser cache

**4. Mobile responsiveness issues**
- Clear browser cache
- Check `responsive.css` loading
- Test in different browsers

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

## 📱 Mobile Setup

### iOS
1. Open Safari
2. Navigate to the app URL
3. Tap share → "Add to Home Screen"
4. Launch as PWA

### Android
1. Open Chrome
2. Navigate to the app URL  
3. Tap menu → "Add to Home Screen"
4. Launch as PWA

## 🔒 Security Notes

- All data stored locally (localStorage)
- No personal data transmitted to servers
- VR permissions handled securely
- HTTPS recommended for production

## 📞 Support

- 📧 **Email**: [your-email@example.com]
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/viksit-vr-education-platform/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/viksit-vr-education-platform/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/viksit-vr-education-platform/wiki)

---

🎉 **Happy Learning with ViksitVR!**

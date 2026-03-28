<div align="center">
  <h1>🛒📍 LocalMart</h1>
  <p><b>Your neighborhood marketplace, right in your pocket.</b></p>

  <p>
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF" alt="Razorpay" />
  </p>
</div>

<br />

Welcome to the **LocalMart** repository! We're building a vibrant, location-aware marketplace app that connects buyers with nearby vendors seamlessly. Whether you're a local business looking to reach your community or a shopper discovering hidden gems right around the corner, LocalMart makes it happen.

### 🎥 App Preview
**[Watch the LocalMart Screen Recording Demo](https://drive.google.com/file/d/1K6zunjARGqMpjccaZ0t9GO49zTWuMBRE/view?usp=drivesdk)**

## 🌟 What is LocalMart?

LocalMart is a mobile application built with React Native and Expo that aims to digitize the local shopping experience. It's designed to be fast, reliable, and incredibly easy to pick up and use for both customers and store owners.

### ✨ Key Features

- **📍 GPS-Based Discovery:** Instantly find nearby vendors using precise location routing and distance filtering. See who is closest to you and get straight to shopping.
- **🏪 Vendor Empowerment:** Open registration means anyone can become a vendor. We provide tools to create professional profiles, handle inventory visually, and build trust through a transparent rating system.
- **💳 Secure Payments:** Quick, frictionless checkout experiences powered by the **Razorpay** payment gateway for secure, end-to-end transactions.
- **⚡ Built for Performance:** Leveraging Expo and React Native to deliver a smooth, native-like experience on both iOS and Android devices.

## 🛠 Tech Stack

Our stack is carefully chosen to ensure a smooth developer experience and powerful native performance.

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) | Cross-platform native app development |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) / NativeWind | Utility-first styling for rapid UI development |
| **Payments** | [Razorpay](https://razorpay.com/) | Secure and fast payment gateway integration |
| **Location** | Expo Location & [Google Maps](https://developers.google.com/maps) | Real-time GPS routing and vendor filtering |

## 🚀 Getting Started

Want to run LocalMart locally? Here is how to get the project up and running on your machine.

### Prerequisites

- **Node.js**: v18 or newer recommended
- **Expo CLI**: `npm install -g expo-cli`
- **External Services**:
  - A Razorpay test account (for payment testing)
  - Google Maps API Key (for Android location features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/localmart.git
   cd localmart/LocalCart
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(Or use `yarn install` / `pnpm install` depending on your package manager)*

3. **Configure Environment:**
   Update your `app.json` with your Google Maps API Key, and set up your environment variables (like a `.env` file) for your Razorpay credentials.

4. **Start the app:**
   ```bash
   npx expo start
   ```
   *Scan the QR code with the Expo Go app on your phone, or run it directly on an iOS/Android emulator.*

## 🤝 Contributing

We love community input! Whether it's a bug fix, squashing a typo, or proposing a whole new feature, feel free to open an issue or submit a pull request. Let's build the best local app together.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. Let's keep local shopping accessible to everyone!

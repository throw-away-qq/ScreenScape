# Screen Scape

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A simple, client-side tool for interactively visualizing the relative physical scale of different computer monitor sizes. [link] (https://throw-away-qq.github.io/ScreenScape/)

<!-- ![demo]("./assets/usage gif.gif") -->
---

## Why does this exist?

Ever wondered what the real-world size difference is between a 24" and a 27" monitor? Or how a 34" ultrawide *really* compares to a 32" 16:9 screen on your desk?

It's surprisingly difficult to judge these differences from a spec sheet alone. Screen Scape solves this problem by providing a "sandbox" where you can configure multiple monitors and see them rendered to scale. You can drag them around, stack them, rotate them, and zoom in to truly understand their dimensions before you buy.

## ✨ Features

-   **Visualize up to 4 Monitors:** Configure up to four monitors with custom diagonal sizes and aspect ratios.
-   **Interactive Sandbox:** Drag and drop monitors anywhere on the canvas to compare them side-by-side or stacked.
-   **90° Rotation:** Click the rotate button to instantly switch between landscape and portrait orientations.
-   **Smooth Zoom & Pan:** Use the zoom slider to get a closer look. Drag monitors around the canvas freely.
-   **Real-time Data:** Instantly see calculated dimensions (inches) and screen area (in²) for every enabled monitor.
-   **Clean & Responsive:** A modern, dark-themed UI that works on both desktop and mobile devices.

## 🛠️ Tech Stack

This project is a pure front-end application built with modern, lightweight tools.

-   **[Vite](https://vitejs.dev/):** A next-generation frontend build tool for a lightning-fast development experience.
-   **[React](https://react.dev/):** A JavaScript library for building user interfaces.
-   **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
-   **[daisyUI](https://daisyui.com/):** A Tailwind CSS component plugin for clean UI elements like toggles.

## 🚀 Getting Started

To run this project locally, you'll need [Node.js](https://nodejs.org/en/) (v16 or higher) installed on your machine.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/screen-scape.git
    ```

2.  **Navigate into the project directory:**
    ```bash
    cd screen-scape
    ```

3.  **Install the necessary dependencies:**
    ```bash
    npm install
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

Now, open your web browser and navigate to **`http://localhost:5173`** (or whatever port Vite indicates in the terminal).

## 🎮 How to Use the Tool
- 
-   **The Sandbox:** The large area at the top is your visualization canvas. The monitors shown here are to scale relative to one another.
-   **The Control Panels:** The panels at the bottom correspond to Monitors A, B, C, and D.
    -   Use the **toggle switch** to enable or disable a monitor.
    -   Enter a **diagonal size** in inches.
    -   Select a common **aspect ratio** from the dropdown.
-   **Actions:**
    -   **Drag:** Click and hold on any monitor in the sandbox to move it around.
    -   **Rotate:** Hover over a monitor and click the rotate icon (↻) that appears in the top-right corner.
    -   **Zoom:** Use the slider in the top-right of the sandbox to zoom in and out.

## 🗺️ Roadmap & Future Ideas

This is a simple tool, but it could be even better. Pull Requests are welcome!

-   [ ] Add an input for monitor bezel size for a more realistic comparison.
-   [ ] Include the option for users to upload a picture of work desk as a backgroun overlay in canvas for a realisic comparison
-   [ ] Create a "share" button that generates a URL with the current monitor configuration saved. With a PNG?
-   [ ] A library of presets for popular monitor models (e.g., "Dell UltraSharp U2723QE").
-   [ ] Add an option to display dimensions in centimeters.
-   [ ] Include PPI numbers and resolution for each monitor configuration
-   [ ] Implement panning the canvas itself, in addition to zooming.

## ⚖️ License

This project is licensed under the MIT License. See the `LICENSE` file for details.

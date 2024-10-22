function generateQRCode(url, bgColor, fillColor, size) {
    // Get or create canvas
    let canvas = document.getElementById("qr-code");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "qr-code";
        const container = document.getElementById("qr-container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(canvas);
    }

    // Set canvas size
    canvas.width = parseInt(size);
    canvas.height = parseInt(size);

    // Create QR code
    const qr = new QRious({
        element: canvas,
        value: url || "https://mozilla.org",
        size: parseInt(size),
        background: bgColor,
        foreground: fillColor,
        backgroundAlpha: 1,
        foregroundAlpha: 1,
        level: 'H', // High error correction
        padding: 0
    });
}

// Function to validate hex color
function isValidHex(color) {
    return /^#[0-9A-F]{6}$/i.test(color);
}

// Function to fetch the current tab URL
async function getCurrentTabUrl() {
    try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        return tabs[0].url;
    } catch (error) {
        console.error("Error getting tab URL:", error);
        return "https://mozilla.org";
    }
}

// Initialize the popup
document.addEventListener("DOMContentLoaded", async () => {
    const urlInput = document.getElementById("url-input");
    const bgColorInput = document.getElementById("bg-color");
    const fillColorInput = document.getElementById("fill-color");
    const sizeInput = document.getElementById("size");

    try {
        // Set default values
        bgColorInput.value = "#FFFFFF";
        fillColorInput.value = "#000000";
        sizeInput.value = "200";

        // Fetch and display the current URL
        const url = await getCurrentTabUrl();
        urlInput.value = url;

        // Initial QR code generation
        generateQRCode(url, bgColorInput.value, fillColorInput.value, sizeInput.value);

        // Event listeners for settings
        bgColorInput.addEventListener("change", () => {
            if (isValidHex(bgColorInput.value)) {
                generateQRCode(urlInput.value, bgColorInput.value, fillColorInput.value, sizeInput.value);
            }
        });

        fillColorInput.addEventListener("change", () => {
            if (isValidHex(fillColorInput.value)) {
                generateQRCode(urlInput.value, bgColorInput.value, fillColorInput.value, sizeInput.value);
            }
        });

        sizeInput.addEventListener("input", () => {
            const size = Math.max(100, Math.min(400, parseInt(sizeInput.value) || 200));
            generateQRCode(urlInput.value, bgColorInput.value, fillColorInput.value, size);
        });

        // Event listener for URL input change
        urlInput.addEventListener("input", () => {
            generateQRCode(urlInput.value || "https://mozilla.org", bgColorInput.value, fillColorInput.value, sizeInput.value);
        });
    } catch (error) {
        console.error("Error initializing popup:", error);
    }
});
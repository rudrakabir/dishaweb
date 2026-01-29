from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console logs to check for errors
    page.on("console", lambda msg: print(f"Console: {msg.text}"))

    print("Navigating to http://localhost:8080")
    page.goto("http://localhost:8080")

    # Wait for the text to appear
    print("Waiting for text...")
    page.wait_for_selector(".valentine-text")

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/screenshot.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

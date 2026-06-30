# Frequently Asked Questions

## Product

**Q: What makes this different from MoTeC, Haltech, or AEM?**
A: Our primary differentiator is the software experience. Existing ECU software looks and feels like Windows 95. Prototype Studio is modern, beautiful, and intuitive — designed to feel more like VS Code or Lightroom than a traditional tuning application. We also offer cloud connectivity, mobile apps, and AI assistance that competitors don't have.

**Q: Is this just a copy of rusEFI?**
A: No. The firmware is based on rusEFI — and we're transparent about that — but everything the customer interacts with is our own. The Studio application, cloud platform, mobile app, documentation, installers, and branding are all original. Over time, we'll progressively replace the rusEFI firmware modules with proprietary implementations.

**Q: How do you compete with free open-source ECUs?**
A: Most enthusiasts who try free ECUs eventually move to paid products because they want professional support, polished software, documentation, and reliability. We're targeting that upgrade path. Our entry price is low enough that it competes favorably with the total cost of building and troubleshooting a DIY system.

## Business

**Q: Why not build the firmware from scratch?**
A: That would take 3-5 years and introduce unnecessary risk. By standing on rusEFI's 10+ years of proven development, we launch with mature engine control and invest our engineering budget where it creates the most value — the software experience, cloud platform, and mobile app.

**Q: What is the revenue model?**
A: Three streams: (1) Hardware margin on ECU sales, (2) SaaS subscriptions for premium Studio features and cloud access, (3) Marketplace commissions on calibration and plugin sales. Future: OEM licensing.

**Q: Who is your target customer?**
A: Initially, the enthusiast builder — someone building a project car who's priced out of $3,000-8,000 ECUs. As we grow, professional workshops and eventually fleet operators and OEMs.

## Technology

**Q: Why Electron for the desktop app?**
A: Electron gives us cross-platform support (Windows, Mac, Linux) from a single codebase. This is 3x faster than building native applications for each platform. The performance penalty is negligible for a tuning application, and modern hardware handles WebGL-accelerated graphics easily.

**Q: Is the platform secure?**
A: Yes. Device-to-cloud communication uses mTLS with X.509 certificates. The bootloader supports secure firmware verification. User authentication uses OAuth 2.0. Security follows ISO/SAE 21434 principles.

## Legal

**Q: What about the GPL license?**
A: The firmware is GPL-3.0, and we comply fully. The desktop application, cloud services, and mobile app are independent works and not subject to the firmware's license. We have a clear roadmap for replacing GPL modules with proprietary implementations.

**Q: Can you use rusEFI in a commercial product?**
A: Yes, as long as we comply with the GPL-3.0 terms. This means providing source code for the firmware to customers who request it. The Studio, cloud, and mobile app are not affected.

## Investment

**Q: What stage are you at?**
A: Pre-seed/seed. We have a documented architecture, proven firmware foundation, and a clear product roadmap. We're looking for funding to build the Studio application, prototype the hardware, and reach commercial launch.

**Q: What is the ask?**
A: Seed round of $500K-$1M to fund Studio development ($300K), hardware prototyping ($100K), cloud infrastructure ($50K), and initial team expansion.

**Q: What is the exit path?**
A: Most likely acquisition by a larger automotive technology company (Bosch, Dana, Holley) or an aftermarket parts distributor. The platform's white-label architecture makes it attractive for companies wanting to enter the ECU market without building from scratch.

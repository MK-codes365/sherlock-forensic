# Sherlock Forensic

Sherlock Forensic is an advanced, AI-powered forensic analysis platform designed to help investigators analyze UFDR (Universal Forensic Data Report) files, uncover critical evidence, and accelerate digital investigations. It provides a secure, intuitive interface for querying vast amounts of forensic data using natural language, visualizing connections, and generating comprehensive reports.

## Key Features

- **Multi-format UFDR Ingestion**: Supports parsing and loading UFDRs in XML and JSON formats for forensic data extraction.
- **Automated Normalization/Cleaning**: Automatically standardizes and cleans UFDR data to ensure consistency and usability.
- **Cryptic Code Decryption**: Decrypts encrypted data within UFDRs using secure cryptographic techniques.
- **Privacy Controls with Anonymization**: Implements anonymization to protect sensitive personal data during analysis.
- **NER-driven Entity Graphing**: Uses spaCy to identify and visualize entities (e.g., names, addresses) as graphs for investigation.
- **AI-powered Timeline Reconstruction**: Constructs timelines from UFDR data using AI to correlate events and activities.
- **Multimedia OCR Analysis**: Extracts text from images and videos in UFDRs using Tesseract for evidence review.
- **Steganography Detection**: Identifies hidden data in UFDR multimedia files using Stegano for security analysis.
- **Sentiment/Voice Analysis**: Analyzes audio sentiment and tone using TextBlob and SpeechRecognition for emotional insights.
- **Pattern Matching**: Detects specific patterns (e.g., crypto addresses) in UFDR text using regex and NLP.
- **Steganography Heatmap Visualization**: Visualizes steganography findings in UFDR files with Matplotlib heatmaps.
- **Basic Hashing for Evidence Integrity**: Ensures data integrity in UFDRs using hashlib SHA-256 verification.
- **Real-time Decoding Dashboard**: Provides a Flask-based dashboard for live decryption and monitoring of UFDR data.
- **Evidence Prioritization**: Ranks UFDR evidence based on relevance using automated prioritization logic.
- **NLP with Voice Command Support**: Enables natural language queries and voice commands via NLTK and SpeechRecognition.
- **Auto-summarized Report Generation**: Generates concise reports from UFDR analysis using ReportLab for quick insights.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative**: [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Charts & Visuals**: [Recharts](https://recharts.org/)

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

### Environment Variables

This project uses Firebase for its backend. The configuration is located in `src/firebase/config.ts`. The Genkit AI flows use the Gemini API, which requires an API key.

1.  Create a `.env` file in the root of the project.
2.  Add your Google AI API key to the file:
    ```
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

### Running the Development Server

You can run the application in development mode with hot-reloading:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).



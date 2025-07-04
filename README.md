# Bandhgora Anchal Football Coaching Camp (BAFCC) Admin Portal

![BAFCC Logo](./public/bafcc-logo.png)

The BAFCC Admin Portal is a web application designed to manage player registrations and administrative tasks for the Bandhgora Anchal Football Coaching Camp. It provides a centralized platform for handling applications, viewing player details, managing financial records, and streamlining the overall camp administration process.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Backend](#api-backend)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

The application boasts a comprehensive suite of features for efficient camp management:

*   **Secure Authentication:** All routes are protected and require admin login, ensuring data security.
*   **Player Registration Form:**
    *   Accessible at `/registration` after admin login.
    *   Supports various age categories for boys and girls (U-11, U-13, U-15, U-17, Open).
    *   Collects detailed personal information, school information, and contact details.
    *   Allows uploading of applicant's photo and Aadhar card.
*   **Admin Dashboard (`/admin/dashboard`):**
    *   Central hub for managing applications.
    *   **View Applications:** Displays a list of all submitted applications with key details.
    *   **Search:** Filter applications by registration number.
    *   **Category Filter:** Filter applications by player category.
    *   **Detailed View:** View complete details of a specific application.
    *   **Edit Application:** Modify existing application data.
    *   **Download PDF:** Generate and download a PDF version of an application, including uploaded images.
    *   **Delete Application:** Remove applications from the system.
    *   **Refresh List:** Manually refresh the application list.
*   **Financial Management (`/admin/financial`):**
    *   Dedicated section for managing financial aspects related to the camp.
    *   (Further details on financial features can be added here as they are known or developed).
*   **Responsive Design:** User interface adapts to various screen sizes for accessibility on different devices.
*   **User-Friendly Interface:** Built with Tailwind CSS for a modern and intuitive user experience, including loading states and notifications.

## Tech Stack

This project is built with a modern web development stack:

*   **Frontend:**
    *   [React](https://reactjs.org/) (v19) with TypeScript
    *   [Vite](https://vitejs.dev/) as the build tool and development server
    *   [Tailwind CSS](https://tailwindcss.com/) (v4) for styling
    *   [React Router DOM](https://reactrouter.com/) (v7) for client-side routing
    *   [Axios](https://axios-http.com/) for making HTTP requests to the backend API
    *   [Lucide React](https://lucide.dev/) for icons
    *   [@react-pdf/renderer](https://react-pdf.org/) for generating PDFs on the client-side
    *   [file-saver](https://github.com/eligrey/FileSaver.js/) for saving generated files
    *   [react-toastify](https://fkhadra.github.io/react-toastify/) for notifications
*   **Development:**
    *   [ESLint](https://eslint.org/) for code linting
    *   [TypeScript](https://www.typescriptlang.org/) for static typing

## API Backend

The frontend application communicates with a separate backend API to fetch and store data. The base URL for this API needs to be configured via an environment variable.

*   The backend is expected to handle authentication, data storage for applications, image processing/storage, and other business logic.
*   Key API endpoints used (examples):
    *   `/api/v1/users/login`
    *   `/api/v1/users/refresh`
    *   `/api/v1/users/logout`
    *   `/api/v1/users/me`
    *   `/api/v1/applications` (and related CRUD endpoints)
    *   `/api/v1/applications/{id}/with_images`

## Environment Variables

To run this project, you need to create a `.env` file in the root directory of the project. This file should contain the following environment variable:

```env
VITE_API_URL=your_backend_api_url
```

Replace `your_backend_api_url` with the actual URL where your backend API is hosted (e.g., `https://bafcc-server.onrender.com` or `http://localhost:8000` for local development).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd bafcc # Or your project directory name
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root and add the `VITE_API_URL` as described in the [Environment Variables](#environment-variables) section.

### Running the Project

Once the installation is complete and environment variables are set up, you can run the development server:

```bash
npm run dev
```

This will start the Vite development server, typically on `http://localhost:5173`. The application will automatically reload if you make changes to the code.

## Available Scripts

In the project directory, you can run the following scripts:

*   `npm run dev`:
    Runs the app in development mode using Vite. Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in your browser.

*   `npm run build`:
    Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

*   `npm run lint`:
    Lints the project files using ESLint to check for code quality and style issues.

*   `npm run preview`:
    Serves the production build from the `dist` folder locally. This is useful for testing the production build before deploying.

## Deployment

This project is configured for deployment using [Firebase Hosting](https://firebase.google.com/docs/hosting).

*   The `.firebaserc` file specifies the Firebase project.
*   GitHub Actions workflows are set up in `.github/workflows/` for:
    *   `firebase-hosting-pull-request.yml`: Deploys to a preview channel when a pull request is opened.
    *   `firebase-hosting-merge.yml`: Deploys to the live channel when changes are merged into the main branch (or the specified deployment branch).

To deploy manually or set up for a different Firebase project, refer to the Firebase Hosting documentation.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a Pull Request.

(Further details on coding standards or specific contribution guidelines can be added here.)

## License

This project is currently unlicensed.
(Consider adding a license like MIT if appropriate: `This project is licensed under the MIT License - see the LICENSE.md file for details.` )

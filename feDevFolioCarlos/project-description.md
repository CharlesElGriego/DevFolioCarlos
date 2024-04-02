# Theme Editor Project

Design and implement a theme editor for a simple profile component. The objective is to allow users to customize the visual appearance of a profile component using a form and see those changes reflected in real time in a profile preview.

## Project Overview

The project should consist of two main components:

- **Form Area:** Where users can edit theme values such as colors, shapes, and other CSS styles.
- **Profile Preview:** A component that displays a profile (with elements like an avatar, name, bio, and a link block) and updates its appearance based on the changes made in the form area.

### Profile Components

The profile component should include the following static elements:

- **Avatar:** An image (e.g., a hardcoded profile picture URL).
- **Name:** A fixed string, like "Zaurbek".
- **Bio:** A short description, like "A little bit about me".
- **Link Block:** A link, like "My blog", that directs to a specific URL (e.g., `https://google.com`).

### Theme Customization

Users should be able to modify the following visual aspects through the theme editor:

- **Avatar Shape:** Choose between a circle or square shape.
- **Text Color for Name/Bio:** Color selection for the text.
- **Link Block:** Customization for border radius, background color, and text color.

### Real-Time Interactivity and Feedback

Changes made in the form area should be instantly applied to the profile preview, allowing users to see the effects of their design choices instantly.

## Backend Integration

You should integrate a provided API to save, load, edit, and delete themes. This adds persistence to user customizations, allowing for the retrieval and modification of previously created themes.

### API Spec

A simple API service is provided for you to use to create and manage themes. The API's contracts are flexible, allowing you to pass any arbitrary JSON to the Save and Update endpoints.

#### Routes

- **GET /theme**: Fetches a list of themes.
- **GET /theme/:id**: Fetches a theme by ID.
- **GET /theme/default**: Fetches the default theme.
- **POST /theme**: Creates a new theme.
- **PATCH /theme/:id**: Updates an existing theme by ID.
- **POST /theme/default/:id**: Sets a theme as the default.
- **DELETE /theme/:id**: Deletes a theme by ID.

The API allows for a high degree of flexibility in how you structure and manage theme data, enabling you to tailor the theme schema to fit the requirements of your theme editor.

### Bonus Points

Feel free to tackle any of the below stretch goals:

- **Additional Styles:** Incorporate more customization options, such as a hover state for the link block.
- **Default Theme:** Implement functionality to set and load a default theme on page load.
- **Additional Profile Route:** Create an additional route (e.g., `/profile`) to view the profile component applying the default theme (or different themes based on URL params).
- **Adjustable Profile Content:** Allow users to customize the profile content, such as the name and bio.

## Notes

The purpose of this challenge is to demonstrate your proficiency with Angular (or a framework of your choosing), your understanding of user interface interactivity, and your ability to integrate backend services in a practical and engaging project.

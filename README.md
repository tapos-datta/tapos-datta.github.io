# Portfolio Website

A modern personal portfolio site built with Vite.js and vanilla HTML/CSS/JS.
It showcases my projects, skills, and background in a clean and responsive layout.
## 🌐 Live Site: [tapos-datta.github.io](https://tapos-datta.github.io).

## 🚀 Features

- **Modern Design**: Clean and professional design with smooth animations and transitions
- **Responsive Layout**: Fully responsive design that works seamlessly across all devices and screen sizes
- **Component-Based Architecture**: Modular HTML components for easy maintenance and updates
- **Fast Performance**: Optimized assets, lazy loading, and efficient code for better performance
- **SEO Friendly**: Proper meta tags, semantic HTML, and optimized content for better search engine visibility
- **Blog Section**: A dedicated blog page where I share insights, tutorials, and updates about my work
- **Interactive Elements**: Engaging user interface with smooth animations and interactive components
- **Contact Form**: Easy-to-use contact form for professional inquiries and collaborations

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **JavaScript**: Vanilla JS with ES6+ features
- **Vite**: Build tool and development server
- **GitHub Pages**: Hosting platform

## 📦 Project Structure

```
├── assets/              # Static assets (images, fonts, etc.)
│   ├── images/         # Image files
│   ├── css/           # CSS files
│   └── js/            # JavaScript files
├── components/         # HTML components
│   ├── header.html
│   ├── footer.html
│   ├── about.html
│   └── ...
├── js/                # JavaScript modules
│   ├── components/    # Component loader
│   └── utils/         # Utility functions
├── index.html         # Main page
├── blog.html          # Blog page
├── vite.config.js     # Vite configuration
└── package.json       # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher, currently using v20.19.2)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/taposdatta/taposdatta.github.io.git
   cd taposdatta.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npx serve dist
   ```

## 🎨 Customization

### Adding New Components

1. Create a new HTML file in the `components/` directory
2. Add the component to the `componentFiles` array in `vite.config.js`
3. Use the component loader to include it in your pages

### Modifying Styles

- Main styles are in `assets/css/main.css`
- Component-specific styles are in their respective CSS files
- CSS variables for theming are defined in `:root`

### Adding Blog Posts

1. Create a new HTML file in the blog posts directory
2. Update the blog listing in `blog.html`
3. Add any necessary assets to the `assets/` directory

## 📝 Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the main branch. The build process:

1. Compiles and minifies assets
2. Copies components to the build directory
3. Updates asset paths for production
4. Generates the final build in the `dist/` directory


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- 🌐 Live Website: [tapos-datta.github.io](https://tapos-datta.github.io)
- 💻 GitHub: [@tapos-datta](https://github.com/tapos-datta)
- 🔗 LinkedIn: [Tapos Datta](https://linkedin.com/in/tapos-datta)
- 📧 Email: [@taposdatta2013](mailto:taposdatta2013@gmail.com)

---

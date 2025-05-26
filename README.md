
# Guardiões do Marumbi - Landing Page

Landing page for the documentary "Guardiões do Marumbi" with an integrated admin panel for content management.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Theme**: Professional black background with yellow/gold and green accents
- **Admin Panel**: Simple content management system at `/admin`
- **JSON-Based**: All content stored in a single `data.json` file
- **Section Management**: Toggle visibility of sections and edit all content
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Project Structure

```
src/
├── pages/
│   ├── Index.tsx          # Main landing page
│   ├── Admin.tsx          # Admin panel
│   └── NotFound.tsx       # 404 page
├── components/ui/         # UI components (shadcn/ui)
└── ...

public/
├── data.json             # Content data file
├── images/               # Image directory
└── ...
```

## Deployment Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Upload Files
Upload the contents of the `dist` folder to your web server.

### 4. Upload Images
Create an `images` folder in your web root and upload the following images:
- `hero-background.jpg` - Hero section background
- `project-image.jpg` - Project section image
- `justification-image.jpg` - Justification section image
- `gallery1.jpg` to `gallery8.jpg` - Gallery images
- `bruno-carvalho.jpg` - Team member photo
- `aventufilm-logo.jpg` - Company logo
- `inrie-yuzo.jpg` - Team member photo
- `qr-code-benfeitoria.png` - QR code for crowdfunding

### 5. Update data.json
The `data.json` file contains all the content. You can:
- Edit it directly on the server
- Use the admin panel at `/admin` to generate an updated version

## Using the Admin Panel

### Access
1. Navigate to `/admin` on your deployed site
2. Enter the password: `guardioes2024`
3. Edit content and settings

### Features
- **Global Settings**: Site title and contact email
- **Section Management**: 
  - Toggle section visibility
  - Edit section titles and menu names
  - Update all text content
  - Modify image paths and video URLs

### Saving Changes
The admin panel generates a downloadable `data.json` file. After making changes:
1. Click "Salvar Alterações"
2. Download the updated `data.json`
3. Upload it to your server to replace the existing file

## Content Sections

1. **Hero**: Main banner with title, tagline, and call-to-action
2. **O Projeto**: Project description, format, and themes
3. **Justificativa**: Why this story matters now
4. **Teasers**: Video teasers and image gallery
5. **Objetivos**: Impact potential and objectives
6. **Equipe**: Team member information
7. **Como Apoiar**: Crowdfunding support section
8. **Contato**: Contact information

## Security Notes

- Change the admin password in `src/pages/Admin.tsx` before deployment
- Consider implementing server-side authentication for better security
- The current implementation downloads the JSON file rather than saving directly to the server

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Fonts**: Montserrat (Google Fonts)
- **Build Tool**: Vite

## Browser Support

Modern browsers including:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Support

For technical support or questions about the landing page, contact the development team.

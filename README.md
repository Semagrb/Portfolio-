# Salma Fithi — Portfolio

A responsive personal portfolio for Salma Fithi, Junior Software Engineer specializing in web development, IT support, and computer networking.

## Experience

The portfolio uses a deep-space visual theme inspired by cosmic twilight: layered nebula gradients, a lightweight canvas starfield, CSS 3D artwork, and interactive project panels. Motion is reduced when the visitor enables the operating system's reduced-motion preference. The site is built with vanilla HTML, CSS, and JavaScript; no front-end build step or 3D framework is required.

## Contents

```text
index.html
css/
  styles.css
js/
  scripts.js
assets/
  images/
    salma-fithi.jpg
    sneika.jpeg
  resumes/
    Salma-Fithi-CV-English.pdf
    Salma-Fithi-CV-Francais.pdf
contact.php
```

## Run locally

Open `index.html` in a browser, or serve the repository with a local static web server. There is no package installation or build command.

## Résumé downloads

The English and French PDFs are available from the download links in the hero section:

- `assets/resumes/Salma-Fithi-CV-English.pdf`
- `assets/resumes/Salma-Fithi-CV-Francais.pdf`

## Contact form

The contact form submits to Formspree at `https://formspree.io/f/xpwavbno`. Set that Formspree form's verified recipient to `fithisalma@proton.me` in the Formspree dashboard; the endpoint's recipient is configured remotely and cannot be changed by this static site. If the request fails, the page offers a `mailto:` fallback to `fithisalma@proton.me`.

`contact.php` is an alternate PHP-hosted handler that sends to the same Proton address. GitHub Pages does not execute PHP, so this handler requires a PHP-capable host and working server mail configuration.
To use it on a PHP host, change the contact form's `action` in `index.html` from the Formspree URL to `contact.php`.

## Updating portfolio details

- Edit profile, experience, projects, skills, education, résumé links, and social links in `index.html`.
- Update colors, layout, responsive behavior, and visual effects in `css/styles.css`.
- Update the canvas starfield, pointer parallax, mobile navigation, and contact form behavior in `js/scripts.js`.

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navbar = document.querySelector(".navbar");

    const cosmicCanvas = document.createElement("canvas");
    cosmicCanvas.className = "cosmic-canvas";
    cosmicCanvas.setAttribute("aria-hidden", "true");
    cosmicCanvas.setAttribute("role", "presentation");
    document.body.prepend(cosmicCanvas);

    const cosmicContext = cosmicCanvas.getContext("2d");
    if (cosmicContext) {
        const context = cosmicContext;
        const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const pointerPreference = window.matchMedia("(pointer: coarse)");
        let stars = [];
        let particles = [];
        let width = 0;
        let height = 0;
        let scrollPosition = window.scrollY;
        let pointerX = 0;
        let pointerY = 0;
        let drawFrame = 0;

        const createField = () => {
            const starCount = Math.min(120, Math.max(45, Math.round((width * height) / 13000)));
            stars = Array.from({ length: starCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() < 0.08 ? 1.15 : Math.random() * 0.75 + 0.3,
                depth: Math.random() * 0.9 + 0.1,
                tint: Math.random() < 0.22 ? "174, 158, 255" : Math.random() < 0.28 ? "124, 185, 255" : "224, 228, 255"
            }));

            particles = Array.from({ length: Math.min(12, Math.max(6, Math.round(width / 120))) }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.8 + 0.7,
                depth: Math.random() * 0.8 + 0.2,
            }));
        };

        const resizeCanvas = () => {
            const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, 1.25));
            const bounds = cosmicCanvas.getBoundingClientRect();
            width = bounds.width;
            height = bounds.height;
            cosmicCanvas.width = Math.round(width * pixelRatio);
            cosmicCanvas.height = Math.round(height * pixelRatio);
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            createField();
            scheduleDraw();
        };

        const drawField = () => {
            context.clearRect(0, 0, width, height);

            stars.forEach((star) => {
                const x = (star.x + pointerX * star.depth * 12 + width) % width;
                const y = (star.y + pointerY * star.depth * 9 + scrollPosition * star.depth * 0.035 + height) % height;
                context.globalAlpha = 0.68;
                context.fillStyle = `rgb(${star.tint})`;
                context.beginPath();
                context.arc(x, y, star.radius, 0, Math.PI * 2);
                context.fill();

                if (star.radius > 1) {
                    context.globalAlpha = 0.28;
                    context.fillRect(x - 3.5, y - 0.35, 7, 0.7);
                    context.fillRect(x - 0.35, y - 3.5, 0.7, 7);
                }
            });

            particles.forEach((particle) => {
                const x = (particle.x + pointerX * particle.depth * 20 + width) % width;
                const y = (particle.y + pointerY * particle.depth * 15 + scrollPosition * particle.depth * 0.065 + height) % height;
                context.globalAlpha = 0.18;
                context.fillStyle = "rgb(176, 156, 255)";
                context.beginPath();
                context.arc(x, y, particle.radius, 0, Math.PI * 2);
                context.fill();
            });

            context.globalAlpha = 1;
        };

        const scheduleDraw = () => {
            if (drawFrame || document.hidden) return;
            drawFrame = window.requestAnimationFrame(() => {
                drawFrame = 0;
                drawField();
            });
        };

        window.addEventListener("resize", resizeCanvas, { passive: true });
        if ("ResizeObserver" in window) {
            new ResizeObserver(resizeCanvas).observe(cosmicCanvas);
        }
        window.addEventListener("scroll", () => {
            scrollPosition = window.scrollY;
            scheduleDraw();
        }, { passive: true });
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) scheduleDraw();
        });

        if (!pointerPreference.matches && !motionPreference.matches) {
            window.addEventListener("pointermove", (event) => {
                pointerX = event.clientX / width - 0.5;
                pointerY = event.clientY / height - 0.5;
                scheduleDraw();
            }, { passive: true });
        }

        resizeCanvas();
    } else {
        cosmicCanvas.remove();
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const closeMenu = () => {
        hamburger?.classList.remove("active");
        navMenu?.classList.remove("active");
        hamburger?.setAttribute("aria-expanded", "false");
        hamburger?.setAttribute("aria-label", "Open navigation menu");
    };

    hamburger?.addEventListener("click", () => {
        const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!isExpanded));
        hamburger.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
        hamburger.classList.toggle("active", !isExpanded);
        navMenu?.classList.toggle("active", !isExpanded);
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            hideSuccessMessage();
        }
    });

    const updateNavbar = () => {
        navbar?.classList.toggle("scrolled", window.scrollY > 12);
    };
    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });

    const successOverlay = document.querySelector("#success-overlay");
    const successMessage = document.querySelector("#success-message");
    const closeOverlayButton = document.querySelector("#close-overlay");
    const previousFocus = { element: null };

    function showSuccessMessage(message = "Thank you for reaching out! I'll get back to you soon.") {
        if (!successOverlay || !successMessage) return;
        previousFocus.element = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        successMessage.textContent = message;
        successOverlay.hidden = false;
        closeOverlayButton?.focus();
    }

    function hideSuccessMessage() {
        if (!successOverlay || successOverlay.hidden) return;
        successOverlay.hidden = true;
        previousFocus.element?.focus();
    }

    closeOverlayButton?.addEventListener("click", hideSuccessMessage);
    successOverlay?.addEventListener("click", (event) => {
        if (event.target === successOverlay) hideSuccessMessage();
    });

    const contactForm = document.querySelector(".contact-form");
    const statusMessage = contactForm?.querySelector(".form-status");

    contactForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!contactForm.reportValidity()) return;

        const submitButton = contactForm.querySelector(".submit-btn");
        if (!(submitButton instanceof HTMLButtonElement)) return;

        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
        if (statusMessage) {
            statusMessage.textContent = "";
            statusMessage.classList.remove("error", "success");
        }

        try {
            const replyToField = contactForm.querySelector('input[name="_replyto"]');
            const formEmail = new FormData(contactForm).get("email");
            if (replyToField instanceof HTMLInputElement && typeof formEmail === "string") {
                replyToField.value = formEmail;
            }

            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { Accept: "application/json" }
            });

            if (!response.ok) {
                throw new Error(`Contact form request failed with status ${response.status}`);
            }

            contactForm.reset();
            showSuccessMessage();
        } catch (error) {
            console.error("Unable to submit the contact form.", error);
            const formData = new FormData(contactForm);
            const name = String(formData.get("name") ?? "");
            const email = String(formData.get("email") ?? "");
            const subject = String(formData.get("subject") ?? "");
            const message = String(formData.get("message") ?? "");
            const mailto = `mailto:fithisalma@proton.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;

            if (statusMessage) {
                statusMessage.textContent = "The form service is unavailable. Your email app will open so you can send the message directly.";
                statusMessage.classList.add("error");
            }
            window.location.href = mailto;
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        document.querySelectorAll(
            ".timeline-item, .project-card, .skills-category, .education-card, .about-text, .about-visual, .contact-info, .contact-form-container"
        ).forEach((element) => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    }

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion.matches) {
        document.querySelectorAll(
            ".project-card, .timeline-content, .education-card, .skills-category, .skill-item, .contact-form-container, .stat-item, .cert-item, .language-item"
        ).forEach((panel) => {
            panel.classList.add("interactive-tilt");
            panel.addEventListener("pointermove", (event) => {
                const bounds = panel.getBoundingClientRect();
                const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
                const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;
                panel.style.setProperty("--tilt-x", `${(verticalPosition * -4).toFixed(2)}deg`);
                panel.style.setProperty("--tilt-y", `${(horizontalPosition * 4).toFixed(2)}deg`);
            });

            panel.addEventListener("pointerleave", () => {
                panel.style.removeProperty("--tilt-x");
                panel.style.removeProperty("--tilt-y");
            });
        });
    }
});

(function () {
    "use strict";

    const WHATSAPP = "50230156804";

    /* NAVBAR: efecto al hacer scroll */

    const nav = document.getElementById("navbar");
    const menuBtn = document.getElementById("menuBtn");

    function onScroll() {
        nav.classList.toggle("scrolled", window.scrollY > 50);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* NAVBAR: menú móvil */

    function setMenu(open) {
        nav.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }

    menuBtn.addEventListener("click", () => {
        setMenu(!nav.classList.contains("open"));
    });

    document.querySelectorAll("#menu a").forEach(link => {
        link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") setMenu(false);
    });

    /* RESEÑAS (datos en js/reviews.js) */

    const reviews = Array.isArray(window.REVIEWS) ? window.REVIEWS : [];
    const reviewsSection = document.getElementById("resenas");
    const reviewsLink = document.getElementById("resenasLink");
    const reviewsGrid = document.getElementById("reviewsGrid");

    if (reviews.length) {

        reviews.forEach(r => {
            const stars = Math.max(1, Math.min(5, Number(r.estrellas) || 5));

            const card = document.createElement("article");
            card.className = "review-card fade";

            const starsEl = document.createElement("div");
            starsEl.className = "review-stars";
            starsEl.textContent = "★".repeat(stars) + "☆".repeat(5 - stars);
            starsEl.setAttribute("role", "img");
            starsEl.setAttribute("aria-label", stars + " de 5 estrellas");

            const text = document.createElement("p");
            text.className = "review-text";
            text.textContent = "“" + r.texto + "”";

            const author = document.createElement("div");
            author.className = "review-author";
            author.textContent = r.nombre;

            card.append(starsEl, text, author);
            reviewsGrid.appendChild(card);
        });

    } else {
        reviewsSection.hidden = true;
        reviewsLink.hidden = true;
    }

    /* ANIMACIONES AL HACER SCROLL */

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".fade").forEach(el => observer.observe(el));

    /* FORMULARIO DE COTIZACIÓN */

    const form = document.getElementById("bookingForm");
    const inicioEl = document.getElementById("fechaInicio");
    const finEl = document.getElementById("fechaFin");
    const errorEl = document.getElementById("formError");

    function toISO(d) {
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return d.getFullYear() + "-" + m + "-" + day;
    }

    // Las fechas "YYYY-MM-DD" se leen como fecha local para evitar el desfase de un día por zona horaria.
    function formatFecha(iso) {
        const [y, m, d] = iso.split("-");
        return d + "/" + m + "/" + y;
    }

    const today = toISO(new Date());
    inicioEl.min = today;
    finEl.min = today;

    inicioEl.addEventListener("change", () => {
        finEl.min = inicioEl.value || today;
        if (finEl.value && finEl.value < finEl.min) finEl.value = "";
    });

    function showError(msg) {
        errorEl.textContent = msg;
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        showError("");

        const nombre = document.getElementById("nombre").value.trim();
        const inicio = inicioEl.value;
        const fin = finEl.value;
        const tipo = document.getElementById("tipoVehiculo").value;

        if (!nombre || !inicio || !fin || !tipo) {
            showError("Por favor completa todos los campos.");
            return;
        }

        if (inicio < today) {
            showError("La fecha de inicio no puede ser anterior a hoy.");
            return;
        }

        if (fin < inicio) {
            showError("La fecha final no puede ser anterior a la fecha de inicio.");
            return;
        }

        const mensaje = encodeURIComponent(
            "Hola, mi nombre es " + nombre + ". Deseo cotizar un vehículo tipo " + tipo +
            " desde " + formatFecha(inicio) + " hasta " + formatFecha(fin) + "."
        );

        const win = window.open(
            "https://wa.me/" + WHATSAPP + "?text=" + mensaje,
            "_blank",
            "noopener,noreferrer"
        );

        if (!win) {
            window.location.href = "https://wa.me/" + WHATSAPP + "?text=" + mensaje;
        }
    });

})();

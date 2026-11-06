/* ==========================================================================
   SHAHI PEST CONTROL - Interactive Website Scripts
   WordPress / Elementor UX Behaviors
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Year in Footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu on clicking any link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 3. Sticky Header Effect & Scroll to Top Visibility
    const header = document.getElementById('header');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Header shadow
        if (header) {
            if (scrollPos > 40) {
                header.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
            }
        }

        // Scroll to top button
        if (scrollToTopBtn) {
            if (scrollPos > 350) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }

        // Active link highlighting on scroll
        updateActiveNavLink();
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Active Nav Link on Scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav-list a[href*="${sectionId}"]`);

            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    // 5. Lightbox Modal for Images
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.lightbox-close');

    window.openLightbox = function(imageSrc, captionText) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = imageSrc;
        if (lightboxCaption) {
            lightboxCaption.textContent = captionText || '';
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    };

    window.closeLightbox = function(event) {
        if (!lightbox) return;
        // Close if click is outside the image or on the close button
        if (!event || event.target === lightbox || event.target.classList.contains('lightbox-close')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => closeLightbox(e));
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // 6. Booking Form Handler
    window.handleBookingSubmit = function(event) {
        event.preventDefault();
        const form = document.getElementById('bookingForm');
        const successMsg = document.getElementById('formSuccessMessage');

        const name = document.getElementById('userName').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const service = document.getElementById('serviceType').value;
        const area = document.getElementById('areaLocation').value;
        const date = document.getElementById('serviceDate').value;
        const address = document.getElementById('userAddress').value.trim();

        if (!name || !phone || !service || !area) {
            alert('দয়া করে আপনার নাম, ফোন নম্বর, সেবার ধরন ও এলাকা পূরণ করুন।');
            return;
        }

        // Compose WhatsApp message link for one-click direct booking
        const waText = `*নতুন পেস্ট কন্ট্রোল বুকিং রিকোয়েস্ট (শাহী পেস্ট কন্ট্রোল)*\n\n👤 নাম: ${name}\n📞 মোবাইল: ${phone}\n🛠️ সার্ভিস: ${service}\n📍 এলাকা: ${area}\n📅 পছন্দের তারিখ: ${date || 'যত দ্রুত সম্ভব'}\n🏠 ঠিকানা/বিবরণ: ${address || 'উল্লেখ নেই'}`;
        const waEncoded = encodeURI(waText);
        const waUrl = `https://wa.me/8801914696616?text=${waEncoded}`;

        // Show success UI
        if (successMsg) {
            successMsg.style.display = 'block';
            successMsg.innerHTML = `
                <div>
                    <h4 style="margin-bottom: 6px; color: #065f46;"><i class="fa-solid fa-circle-check"></i> ধন্যবাদ ${name}! আপনার রিকোয়েস্ট প্রস্তুত।</h4>
                    <p style="font-size: 0.95rem; margin-bottom: 12px; color: #1e293b;">১০ মিনিটের মধ্যে আমাদের টিম আপনাকে কল করবে। আপনি চাইলে এখনই এটি সরাসরি হোয়াটসঅ্যাপেও পাঠিয়ে দিতে পারেন:</p>
                    <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm" style="display: inline-flex;">
                        <i class="fa-brands fa-whatsapp"></i> এক ক্লিকে হোয়াটসঅ্যাপে নিশ্চিত করুন
                    </a>
                </div>
            `;
        }

        form.reset();

        // Scroll to success notification
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
});

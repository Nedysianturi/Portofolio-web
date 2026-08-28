/**
 * KENNEDI SIANTURI - PORTFOLIO INTERACTIVE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // =========================================================
  // 1. PARTICLES CANVAS ANIMATION
  // =========================================================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(59, 130, 246, 0.3)';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function renderCanvas() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = 0.15 * (1 - dist / 120);
            ctx.strokeStyle = isDark ? `rgba(6, 182, 212, ${alpha})` : `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw(isDark);
      });

      requestAnimationFrame(renderCanvas);
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    initParticles();
    renderCanvas();
  }

  // =========================================================
  // 2. THEME SWITCHER (DARK / LIGHT MODE)
  // =========================================================
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('ks_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('ks_portfolio_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'light') {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    }
  }

  // =========================================================
  // 3. DYNAMIC TYPEWRITER EFFECT
  // =========================================================
  const typewriterElement = document.getElementById('typewriterText');
  const roles = [
    'Spesialis IT & Web Development',
    'Staff Administrasi & Data Keuangan',
    'Desain Grafis Photoshop & Media Sosial',
    'Infrastruktur Jaringan, CCTV & Fingerprint',
    'Sarjana Sistem Informasi (IPK 3,59)'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeRole() {
    if (!typewriterElement) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(typeRole, typingSpeed);
  }

  typeRole();

  // =========================================================
  // 4. NAVBAR SCROLL & ACTIVE SPY
  // =========================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar Scrolled Glass effect
    if (navbar) {
      if (scrollPos > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // ScrollSpy for Nav Links
    let currentSectionId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Hamburger Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // =========================================================
  // 5. EXPERIENCE FILTERING
  // =========================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        if (filterVal === 'all' || categories.includes(filterVal)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================
  // 6. PROJECTS FILTERING
  // =========================================================
  const projectFilters = document.querySelectorAll('.p-filter');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-pfilter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-pcat');
        if (filterVal === 'all' || cat === filterVal) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================
  // 7. PROJECT DETAILS MODAL POPUP
  // =========================================================
  const projectModal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const openModalButtons = document.querySelectorAll('.open-project-modal');

  const projectData = {
    'tadika-web': {
      title: 'Pengembangan & Pemeliharaan Website Yayasan Tadika Puri',
      organization: 'Yayasan Tadika Puri (2021 – Sekarang)',
      role: 'Staff IT & Web Administrator',
      overview: 'Mengelola ekosistem digital yayasan agar selalu terkini, cepat, dan mudah diakses oleh calon siswa serta masyarakat.',
      points: [
        'Pembaruan struktur navigasi dan visual antarmuka website.',
        'Publikasi berkala artikel program pelatihan, pengumuman, dan brosur digital.',
        'Pemantauan performa web hosting, optimasi kecepatan, dan keamanan dari ancaman siber.',
        'Integrasi tombol pendaftaran langsung ke WhatsApp admin dan formulir online.'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Content Management', 'Web Hosting & Domain DNS']
    },
    'safira-web': {
      title: 'Pengembangan Website Korporat PT. Safira Jayatelkomindo',
      organization: 'PT. Safira Jayatelkomindo (2013 – 2014)',
      role: 'Lead Web Developer & IT Staff',
      overview: 'Bertanggung jawab atas seluruh siklus hidup pembuatan website perusahaan dari tahap konsep, perancangan antarmuka, hingga peluncuran live.',
      points: [
        'Merancang wireframe, skema warna, dan mockup tata letak website.',
        'Mengembangkan halaman katalog produk sistem keamanan (CCTV, sensor alarm, fingerprint).',
        'Melakukan uji fungsionalitas dan kompatibilitas browser.',
        'Menyelenggarakan sesi pelatihan dan membuat panduan teknis pengelolaan konten untuk staf perusahaan.'
      ],
      tech: ['Full Web Lifecycle', 'UI/UX Design', 'Hardware Catalog Integration', 'Technical Documentation']
    },
    'creative-design': {
      title: 'Desain Materi Promosi & Manajemen Media Sosial',
      organization: 'Yayasan Tadika Puri (2021 – Sekarang)',
      role: 'Graphic Designer & Social Media Handler',
      overview: 'Menciptakan identitas visual yang konsisten dan menarik untuk seluruh kampanye promosi program pendidikan yayasan.',
      points: [
        'Mendesain puluhan poster promosi, brosur penerimaan, dan banner kegiatan menggunakan Adobe Photoshop.',
        'Merancang template konten Instagram feed, story, dan format promosi digital lainnya.',
        'Menganalisis performa interaksi (engagement, jangkauan, dan tayangan) media sosial.',
        'Mendukung peningkatan jumlah pendaftar baru melalui visual marketing yang informatif.'
      ],
      tech: ['Adobe Photoshop', 'Visual Branding', 'Social Media Analytics', 'Copywriting & Content Strategy']
    },
    'security-system': {
      title: 'Implementasi Sistem Keamanan CCTV, Alarm & Absensi Biometrik',
      organization: 'PT. Safira Jayatelkomindo (2013 – 2014)',
      role: 'Security & Hardware IT Technician',
      overview: 'Instalasi dan konfigurasi sistem keamanan terpadu multi-perangkat untuk proteksi aset perusahaan dan pencatatan presensi karyawan.',
      points: [
        'Instalasi jalur kabel coaxial / UTP dan penempatan sudut pandang kamera CCTV strategis.',
        'Konfigurasi DVR/NVR sistem pemantauan jarak jauh melalui jaringan komputer.',
        'Pemasangan sensor alarm pengaman pintu dan sensor gerak.',
        'Instalasi mesin absensi sidik jari (fingerprint biometric) serta sinkronisasi software data kehadiran pegawai.'
      ],
      tech: ['CCTV DVR/NVR', 'Biometric Fingerprint Scanner', 'Security Sensor Alarms', 'Network Cabling & Hardware']
    },
    'night-audit': {
      title: 'Rekonsiliasi Night Audit, City Ledger & Laporan Eksekutif GM',
      organization: 'Megara Hotel (2017 – 2020)',
      role: 'Staff IT Night Audit',
      overview: 'Memastikan keakuratan data pendapatan kamar, piutang perusahaan rekanan, dan saldo kas harian hotel sebelum penutupan pembukuan harian.',
      points: [
        'Memeriksa seluruh tagihan tamu, voucher diskon, dan kesesuaian deposit kasir.',
        'Audit status piutang perusahaan (City Ledger) dan verifikasi transaksi pembayaran instansi.',
        'Menyusun rekapitulasi laporan harian (Daily Revenue Report) dan mencetak dokumen untuk General Manager.',
        'Menangani dukungan teknis komputer resepsionis dan jaringan hotel serta perbaikan teknis fasilitas kamar.'
      ],
      tech: ['Hospitality PMS', 'City Ledger Accounting', 'Financial Reconciliation', 'Executive Reporting', 'LAN Troubleshooting']
    },
    'school-admin': {
      title: 'Administrasi Keuangan SPP, Kas Kecil & Sinkronisasi Data Guru',
      organization: 'TK Elshadday Kids (2014 – 2017)',
      role: 'Staff Administrasi',
      overview: 'Menjaga kelancaran operasional administrasi sekolah melalui pengelolaan pembukuan yang tertib, akurat, dan sesuai regulasi.',
      points: [
        'Pencatatan dan verifikasi pembayaran SPP seluruh siswa setiap bulan tanpa selisih.',
        'Pengelolaan petty cash (kas kecil) untuk kebutuhan logistik dan operasional sekolah.',
        'Pengarsipan dan pengajuan berkas data guru dan tenaga kependidikan ke dinas pemerintah.',
        'Penyusunan surat-menyurat resmi dan komunikasi dengan orang tua murid.'
      ],
      tech: ['Microsoft Excel (SUM/Spreadsheet)', 'Petty Cash Bookkeeping', 'Government Administrative Filing', 'Official Correspondence']
    }
  };

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projKey = btn.getAttribute('data-project');
      const data = projectData[projKey];
      if (data && modalContent && projectModal) {
        modalContent.innerHTML = `
          <div style="margin-bottom: 1.5rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">${data.organization}</span>
            <h2 style="font-size: 1.6rem; color: var(--text-primary); margin: 0.35rem 0;">${data.title}</h2>
            <span style="display: inline-block; padding: 0.2rem 0.75rem; background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">Peran: ${data.role}</span>
          </div>

          <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid var(--accent-cyan);">
            <p style="font-size: 0.95rem; line-height: 1.6; margin: 0;">${data.overview}</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-primary);"><i class="fa-solid fa-list-check" style="color: var(--accent-cyan);"></i> Ruang Lingkup & Pencapaian:</h4>
            <ul style="padding-left: 1.25rem; list-style: disc; display: flex; flex-direction: column; gap: 0.5rem;">
              ${data.points.map(pt => `<li style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">${pt}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-primary);"><i class="fa-solid fa-wrench" style="color: var(--accent-cyan);"></i> Kompetensi & Tools yang Diterapkan:</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${data.tech.map(t => `<span style="padding: 0.3rem 0.8rem; background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 9999px; font-size: 0.8rem; color: var(--accent-cyan); font-weight: 600;">${t}</span>`).join('')}
            </div>
          </div>
        `;
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeModalBtn && projectModal) {
    closeModalBtn.addEventListener('click', () => {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // =========================================================
  // 8. CV / RESUME MODAL & PRINT FUNCTIONALITY
  // =========================================================
  const resumeModal = document.getElementById('resumeModal');
  const openResumeModalBtn = document.getElementById('openResumeModal');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const printCvBtn = document.getElementById('printCvBtn');

  if (openResumeModalBtn && resumeModal) {
    openResumeModalBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeResumeModalBtn && resumeModal) {
    closeResumeModalBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // =========================================================
  // 9. INTERACTIVE WHATSAPP & EMAIL BUILDER
  // =========================================================
  const waForm = document.getElementById('waForm');
  const sendEmailBtn = document.getElementById('sendEmailBtn');

  if (waForm) {
    waForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const topic = document.getElementById('waTopic').value;
      const message = document.getElementById('senderMessage').value.trim();

      const waNumber = '6282285883512';
      const textMessage = `Halo Kennedi Sianturi,\n\nSaya: *${name}*\nPerihal: *${topic}*\n\nPesan:\n${message}\n\n(Dikirim melalui Portofolio Web)`;

      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(textMessage)}`;
      window.open(waUrl, '_blank');
    });
  }

  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      const name = document.getElementById('senderName').value.trim() || 'Pengunjung Portofolio';
      const topic = document.getElementById('waTopic').value;
      const message = document.getElementById('senderMessage').value.trim();

      const emailTo = 'kennedysianturi@gmail.com';
      const subject = `[Portofolio Web] ${topic} - dari ${name}`;
      const body = `Halo Kennedi Sianturi,\n\nNama / Perusahaan: ${name}\nTopik: ${topic}\n\nPesan:\n${message}\n\nSalam,\n${name}`;

      const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }

  // Smooth scroll for anchor tags
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
});

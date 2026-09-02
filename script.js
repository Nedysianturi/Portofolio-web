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
      role: 'Staff IT & Digital Media Specialist',
      overview: 'Mengelola dan mengembangkan ekosistem digital yayasan agar selalu adaptif, cepat diakses, dan memudahkan interaksi calon peserta program dan publik.',
      points: [
        'Meremajakan navigasi dan tata letak visual website untuk kenyamanan pengunjung.',
        'Mengintegrasikan sistem pendaftaran dan konsultasi program via direct WhatsApp CTA.',
        'Memantau performa server hosting, kecepatan loading halaman, dan keamanan berkala.',
        'Mempublikasikan artikel kegiatan, pengumuman formal, dan kurikulum pelatihan secara tepat waktu.'
      ],
      results: [
        'Tingkat waktu aktif (uptime) website terjaga stabil di 99.9%.',
        'Peningkatan efisiensi respon calon pendaftar via integrasi tombol WhatsApp CTA.',
        'Akses publik terhadap kurikulum dan jadwal pelatihan menjadi jauh lebih cepat dan terstruktur.'
      ],
      tech: ['HTML5 & CSS3', 'JavaScript ES6', 'Web Content Management', 'Hosting & Domain DNS', 'SEO & Speed Optimization']
    },
    'safira-web': {
      title: 'Pengembangan Website Korporat PT. Safira Jayatelkomindo',
      organization: 'PT. Safira Jayatelkomindo (2013 – 2014)',
      role: 'Web Developer & IT Staff',
      overview: 'Memimpin seluruh siklus perancangan dan peluncuran website korporat perusahaan dari konsep desain hingga online deployment.',
      points: [
        'Merancang wireframe, mockup visual, dan arsitektur navigasi halaman perusahaan.',
        'Membangun etalase produk sistem keamanan terpadu (CCTV, sensor alarm, fingerprint scanner).',
        'Melakukan uji performa, responsivitas lintas peramban (cross-browser), dan live hosting setup.',
        'Menyusun panduan teknis serta melatih staf internal dalam pengelolaan konten website.'
      ],
      results: [
        'Keberhasilan peluncuran live website resmi pertama PT. Safira Jayatelkomindo.',
        'Katalog produk sistem keamanan terintegrasi secara rapi dan profesional.',
        'Staf internal mandiri mengelola pembaruan sistem berkat modul pelatihan teknis terstruktur.'
      ],
      tech: ['Full Web Lifecycle', 'UI/UX Layout', 'Hardware Catalog Showcase', 'Technical Training & Docs']
    },
    'creative-design': {
      title: 'Desain Materi Promosi & Manajemen Media Sosial',
      organization: 'Yayasan Tadika Puri (2021 – Sekarang)',
      role: 'Graphic Designer & Social Media Strategist',
      overview: 'Menciptakan identitas visual kreatif dan konsisten untuk mendukung seluruh kampanye penerimaan peserta dan kegiatan yayasan.',
      points: [
        'Memproduksi puluhan poster promosi, brosur, banner, dan kartu informasi dengan Adobe Photoshop.',
        'Menyusun konsep feed Instagram interaktif untuk meningkatkan engagement dan citra brand.',
        'Mengevaluasi analitik performa konten (jangkauan, interaksi, dan respon audiens).',
        'Mendongkrak daya tarik program pelatihan sehingga mendatangkan calon pendaftar potensial.'
      ],
      results: [
        'Memproduksi 50+ aset desain visual siap pakai untuk promosi media digital dan materi cetak.',
        'Peningkatan interaksi (engagement rate) akun media sosial resmi yayasan secara konsisten.',
        'Visual branding yang profesional berhasil mendongkrak minat dan kepercayaan calon peserta.'
      ],
      gallery: [
        { img: '/design-1.jpg', title: 'Poster Selebrasi Alumni Lion Group', category: 'Alumni Career', desc: 'Desain selebrasi alumni Tadika Puri yang diterima kerja di PT. Triperkasa Dirgantara (Lion Group).' },
        { img: '/design-2.jpg', title: 'Flyer HUT ke-48 & Pendaftaran TK Tadika Puri', category: 'Promo Pendidikan', desc: 'Flyer pendaftaran murid baru playgroup & TK menyambut HUT ke-48 Tadika Puri & HUT ke-80 RI.' },
        { img: '/design-3.png', title: 'Story Template Cruise Line & Hotel School', category: 'Social Media Story', desc: 'Banner vertikal story syarat dan benefit pelatihan kapal pesiar & perhotelan.' },
        { img: '/design-4.jpg', title: 'Poster Pelatihan Perhotelan & Kapal Pesiar', category: 'Poster Pelatihan', desc: 'Poster pendaftaran pelatihan 4 bulan teori & 6 bulan On the Job Training.' },
        { img: '/design-5.png', title: 'Infografis Rekrutmen Eksekutif KidzEducare', category: 'Infografis Rekrutmen', desc: 'Infografis lowongan kerja posisi Tangan Kanan Direktur berstruktur 3 pilar.' }
      ],
      tech: ['Adobe Photoshop', 'Visual Branding', 'Marketing Collateral', 'Social Media Analytics', 'Content Strategy']
    },
    'security-system': {
      title: 'Implementasi Sistem Keamanan CCTV, Alarm & Absensi Biometrik',
      organization: 'PT. Safira Jayatelkomindo (2013 – 2014)',
      role: 'Security & Hardware IT Technician',
      overview: 'Eksekusi pemasangan dan konfigurasi perangkat keras keamanan fisik multi-titik untuk proteksi aset kantor dan pencatatan presensi pegawai.',
      points: [
        'Instalasi jalur pengkabelan terstruktur dan penempatan kamera CCTV pada sudut strategis.',
        'Konfigurasi DVR/NVR pemantauan video jarak jauh via jaringan komputer lokal.',
        'Pemasangan sensor alarm pengaman pintu dan sensor gerak perimeter.',
        'Integrasi mesin absensi biometrik sidik jari (fingerprint) dan sinkronisasi software absensi pegawai.'
      ],
      results: [
        'Pengawasan keamanan area kantor beroperasi 24/7 tanpa area buta (blind spots).',
        'Pencatatan data presensi sidik jari karyawan 100% akurat tanpa kemungkinan manipulasi.',
        'Sistem alarm darurat teruji aktif memberikan perlindungan perimeter aset perusahaan.'
      ],
      tech: ['CCTV DVR/NVR', 'Biometric Fingerprint Scanner', 'Security Sensor Alarms', 'Network Cabling & Hardware Setup']
    },
    'night-audit': {
      title: 'Rekonsiliasi Night Audit, City Ledger & Laporan Eksekutif GM',
      organization: 'Megara Hotel (2017 – 2020)',
      role: 'Staff IT & Night Audit Specialist',
      overview: 'Menjalankan audit presisi tinggi atas pendapatan harian kamar, piutang perusahaan rekanan, dan saldo kas hotel sebelum pembukuan hari berikutnya.',
      points: [
        'Memeriksa dan merekonsiliasi seluruh tagihan transaksi kamar, diskon, dan deposit kasir tanpa selisih.',
        'Melakukan audit berkala atas status piutang korporat rekanan (City Ledger).',
        'Menyusun rekapitulasi laporan eksekutif harian (Daily Revenue Report) langsung ke General Manager.',
        'Memberikan dukungan teknis sistem PMS hotel serta penanganan cepat fasilitas kamar (kunci elektronik, AC, listrik).'
      ],
      results: [
        'Tercapainya rekonsiliasi audit keuangan 100% seimbang (Zero Error Balance).',
        'Laporan harian eksekutif selalu tersaji tepat waktu di meja General Manager setiap pukul 07.00 pagi.',
        'Stabilitas sistem PMS hotel tetap terjaga dan penanganan cepat keluhan fasilitas kamar tamu.'
      ],
      tech: ['Hospitality PMS', 'City Ledger Accounting', 'Financial Reconciliation', 'Executive Reporting', 'LAN & Hardware Support']
    },
    'school-admin': {
      title: 'Administrasi Keuangan SPP, Kas Kecil & Sinkronisasi Data Guru',
      organization: 'TK Elshadday Kids (2014 – 2017)',
      role: 'Staff Administrasi & Keuangan Sekolah',
      overview: 'Menjaga tata kelola administrasi dan keuangan sekolah yang tertib, transparan, akuntabel, serta patuh pada regulasi kedinasan.',
      points: [
        'Pencatatan dan rekonsiliasi penerimaan SPP siswa setiap bulan dengan akurasi 100%.',
        'Pengelolaan petty cash (kas kecil) untuk kebutuhan logistik dan operasional harian sekolah.',
        'Pengarsipan dan pengajuan berkas pendataan guru dan tenaga kependidikan ke dinas pendidikan pemerintah.',
        'Penyusunan korespondensi surat resmi dan komunikasi santun dengan para orang tua murid.'
      ],
      results: [
        'Tata kelola arus kas kecil dan pembayaran SPP siswa terbebas dari defisit (Zero Deficit).',
        '100% berkas data guru dan staf disetujui dinas pendidikan pemerintah secara tepat waktu tanpa revisi.',
        'Sistem kearsipan dokumen sekolah tertata rapi dan hubungan dengan orang tua murid berjalan harmonis.'
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
            <span style="display: inline-block; padding: 0.25rem 0.85rem; background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">Peran: ${data.role}</span>
          </div>

          <div style="margin-bottom: 1.5rem; padding: 1.1rem; background: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid var(--accent-cyan);">
            <p style="font-size: 0.95rem; line-height: 1.6; margin: 0; color: var(--text-secondary);">${data.overview}</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-primary);"><i class="fa-solid fa-list-check" style="color: var(--accent-cyan);"></i> Ruang Lingkup & Cakupan Kerja:</h4>
            <ul style="padding-left: 1.25rem; list-style: disc; display: flex; flex-direction: column; gap: 0.5rem;">
              ${data.points.map(pt => `<li style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">${pt}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-bottom: 1.5rem; padding: 1.1rem; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px;">
            <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--accent-emerald); display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-trophy text-warning"></i> Hasil Akhir & Dampak Terukur:</h4>
            <ul style="padding-left: 1.25rem; list-style: disc; display: flex; flex-direction: column; gap: 0.5rem;">
              ${data.results.map(res => `<li style="font-size: 0.9rem; color: var(--text-primary); font-weight: 500; line-height: 1.5;">${res}</li>`).join('')}
            </ul>
          </div>

          ${data.gallery ? `
            <div style="margin-bottom: 1.5rem;">
              <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-primary);"><i class="fa-solid fa-images" style="color: var(--accent-cyan);"></i> Galeri Karya Desain Promosi Nyata:</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(105px, 1fr)); gap: 0.75rem;">
                ${data.gallery.map(g => `
                  <div class="gallery-thumb-item" style="border-radius: 6px; overflow: hidden; border: 1px solid var(--border-color); aspect-ratio: 4/5; background: #000; cursor: pointer;" onclick="window.openDesignLightbox('${g.img}', '${data.organization}', '${g.title}', '${g.category}', 'Adobe Photoshop', '${g.desc}')">
                    <img src="${g.img}" alt="${g.title}" style="width: 100%; height: 100%; object-fit: cover;">
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div>
            <h4 style="font-size: 1rem; margin-bottom: 0.75rem; color: var(--text-primary);"><i class="fa-solid fa-wrench" style="color: var(--accent-cyan);"></i> Kompetensi & Tools yang Diterapkan:</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${data.tech.map(t => `<span style="padding: 0.35rem 0.85rem; background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 9999px; font-size: 0.8rem; color: var(--accent-cyan); font-weight: 600;">${t}</span>`).join('')}
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
  // 7B. DESIGN LIGHTBOX MODAL HANDLERS
  // =========================================================
  const designLightboxModal = document.getElementById('designLightboxModal');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClient = document.getElementById('lightboxClient');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxSoftware = document.getElementById('lightboxSoftware');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxFullLink = document.getElementById('lightboxFullLink');

  window.openDesignLightbox = function(imgSrc, client, title, category, software, desc) {
    if (!designLightboxModal) return;
    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxClient) lightboxClient.textContent = client || 'Karya Desain Grafis';
    if (lightboxTitle) lightboxTitle.textContent = title || 'Pratinjau Desain';
    if (lightboxCategory) lightboxCategory.textContent = category || 'Desain Grafis';
    if (lightboxSoftware) lightboxSoftware.textContent = software || 'Adobe Photoshop';
    if (lightboxDesc) lightboxDesc.textContent = desc || '';
    if (lightboxFullLink) lightboxFullLink.href = imgSrc;
    designLightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('.open-design-modal').forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const client = card.getAttribute('data-client');
      const title = card.getAttribute('data-title');
      const category = card.getAttribute('data-category');
      const software = card.getAttribute('data-software');
      const desc = card.getAttribute('data-desc');
      window.openDesignLightbox(imgSrc, client, title, category, software, desc);
    });
  });

  if (closeLightboxBtn && designLightboxModal) {
    closeLightboxBtn.addEventListener('click', () => {
      designLightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    designLightboxModal.addEventListener('click', (e) => {
      if (e.target === designLightboxModal) {
        designLightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && designLightboxModal.classList.contains('active')) {
        designLightboxModal.classList.remove('active');
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

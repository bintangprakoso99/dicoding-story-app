class AboutPage {
  render(container) {
    container.innerHTML = `
      <div class="about-container">
        <h1 class="page-title">Tentang Aplikasi</h1>
        
        <div class="about-content">
          <div class="about-section">
            <h2>Dicoding Story App</h2>
            <p>Aplikasi berbagi cerita yang memungkinkan pengguna untuk berbagi pengalaman mereka bersama Dicoding melalui foto dan cerita.</p>
          </div>
          
          <div class="about-section">
            <h2>Fitur Utama</h2>
            <ul>
              <li>Berbagi cerita dengan foto dan lokasi</li>
              <li>Melihat cerita dari pengguna lain</li>
              <li>Melihat lokasi cerita di peta</li>
              <li>Mengambil foto langsung dari kamera</li>
              <li>Notifikasi push untuk aktivitas baru</li>
            </ul>
          </div>
          
          <div class="about-section">
            <h2>Teknologi</h2>
            <ul>
              <li>Single Page Application (SPA)</li>
              <li>Model-View-Presenter (MVP) Architecture</li>
              <li>Web API (Camera, Geolocation, Web Push)</li>
              <li>View Transition API</li>
              <li>Leaflet Maps</li>
            </ul>
          </div>
          
          <div class="about-section">
            <h2>Dibuat Oleh</h2>
            <p>Aplikasi ini dibuat sebagai proyek submission untuk kelas Dicoding.</p>
          </div>
        </div>
      </div>
    `
  }
}

export default AboutPage

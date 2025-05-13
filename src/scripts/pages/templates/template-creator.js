const createStoryItemTemplate = (story) => `
  <div class="story-item-content">
    <div class="story-item-thumbnail">
      <img src="${story.photoUrl}" alt="${story.name}'s story" class="story-thumbnail">
    </div>
    <div class="story-item-info">
      <h2 class="story-item-name">${story.name}</h2>
      <p class="story-item-description">${story.description}</p>
      <p class="story-item-date">${new Date(story.createdAt).toLocaleDateString()}</p>
    </div>
  </div>
  <div class="story-item-action">
    <a href="#/detail/${story.id}" class="story-item-link" aria-label="Lihat detail cerita dari ${story.name}">
      Lihat Detail
    </a>
  </div>
`

const createStoryDetailTemplate = (story) => `
  <div class="story-detail-content">
    <h1 class="story-detail-name">${story.name}</h1>
    <div class="story-detail-image">
      <img src="${story.photoUrl}" alt="${story.name}'s story" class="story-image">
    </div>
    <div class="story-detail-info">
      <p class="story-detail-description">${story.description}</p>
      <p class="story-detail-date">Dibagikan pada: ${new Date(story.createdAt).toLocaleString()}</p>
      ${story.lat && story.lon ? `<p class="story-detail-location">Lokasi: ${story.lat.toFixed(6)}, ${story.lon.toFixed(6)}</p>` : ""}
    </div>
  </div>
`

const createLoadingTemplate = () => `
  <div class="loading-indicator">
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  </div>
`

const createErrorTemplate = (message) => `
  <div class="error-message">
    <p>${message}</p>
  </div>
`

export { createStoryItemTemplate, createStoryDetailTemplate, createLoadingTemplate, createErrorTemplate }

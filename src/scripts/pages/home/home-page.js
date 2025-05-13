import StoryRepository from "../../data/story-repository"
import { ViewTransitionHelper } from "../../utils"
import { createStoryItemTemplate, createLoadingTemplate, createErrorTemplate } from "../templates/template-creator"

class HomePage {
  constructor() {
    this._stories = []
    this._page = 1
    this._hasMoreData = true
    this._isLoading = false
  }

  async render(container) {
    this._container = container

    this._container.innerHTML = `
      <div class="home-container">
        <h1 class="page-title">Dicoding Story</h1>
        <p class="page-description">Bagikan cerita dan pengalamanmu bersama Dicoding</p>
        
        <div class="story-list" id="storyList">
          <div class="empty-state">
            <p>Belum ada cerita yang dibagikan</p>
            <a href="#/add" class="button">Bagikan Cerita Pertama</a>
          </div>
        </div>
        
        <div id="loadingContainer" class="loading-container"></div>
        <div id="errorContainer" class="error-container"></div>
        
        <div class="add-button-container">
          <button id="addStoryButton" class="add-button" aria-label="Tambah cerita baru">
            <span class="add-icon">+</span>
          </button>
        </div>
      </div>
    `

    this._storyListContainer = this._container.querySelector("#storyList")
    this._loadingContainer = this._container.querySelector("#loadingContainer")
    this._errorContainer = this._container.querySelector("#errorContainer")

    this._renderLoading(true)
    await this._fetchStories()
    this._renderLoading(false)

    this._initButtons()
    this._initInfiniteScroll()
  }

  async _fetchStories() {
    try {
      if (this._isLoading || !this._hasMoreData) return

      this._isLoading = true
      this._renderLoading(true)

      const stories = await StoryRepository.getAllStories({
        page: this._page,
        size: 10,
        location: 1,
      })

      this._isLoading = false
      this._renderLoading(false)

      if (stories.length === 0) {
        this._hasMoreData = false
        return
      }

      this._stories = [...this._stories, ...stories]
      this._page += 1

      this._renderStories()
    } catch (error) {
      this._isLoading = false
      this._renderLoading(false)
      this._renderError(error.message)
    }
  }

  _renderStories() {
    if (this._stories.length === 0) {
      this._storyListContainer.innerHTML = `
        <div class="empty-state">
          <p>Belum ada cerita yang dibagikan</p>
          <a href="#/add" class="button">Bagikan Cerita Pertama</a>
        </div>
      `
      return
    }

    this._storyListContainer.innerHTML = ""

    this._stories.forEach((story) => {
      const storyItem = document.createElement("div")
      storyItem.classList.add("story-item")
      storyItem.innerHTML = createStoryItemTemplate(story)

      storyItem.querySelector(".story-item-content").addEventListener("click", () => {
        ViewTransitionHelper.slideTransition(storyItem, () => {
          window.location.hash = `#/detail/${story.id}`
        })
      })

      this._storyListContainer.appendChild(storyItem)
    })
  }

  _renderLoading(isLoading) {
    if (isLoading) {
      this._loadingContainer.innerHTML = createLoadingTemplate()
    } else {
      this._loadingContainer.innerHTML = ""
    }
  }

  _renderError(message) {
    this._errorContainer.innerHTML = createErrorTemplate(message)
  }

  _initButtons() {
    const addButton = this._container.querySelector("#addStoryButton")
    if (addButton) {
      addButton.addEventListener("click", () => {
        ViewTransitionHelper.fadeTransition(addButton, () => {
          window.location.hash = "#/add"
        })
      })
    }
  }

  _initInfiniteScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this._isLoading && this._hasMoreData) {
          this._fetchStories()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(this._loadingContainer)
  }
}

export default HomePage

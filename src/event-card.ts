import { LitElement, html, css } from "lit-element";
import { customElement, property } from "lit/decorators.js";
import { BOOTSTRAP_CALENDAR, BOOTSTRAP_GROUP } from "./constants";

@customElement("event-card")
export class EventCard extends LitElement {
  static override styles = css`
    :host {
      box-sizing: border-box;
      height: auto;
      min-width: 200px;
      min-height: 350px;
      display: block;
    }

    .general-card {
      overflow: hidden;
      border-radius: 8px;
      border-width: 1px;
      height: 100%;
      box-shadow: none;
      text-decoration: none;
      text-align: center;
      display: flex;
      flex-direction: column;
      padding: 1em;
      cursor: pointer;
      box-sizing: border-box;
      /* margin: 3px; */
      border: 1px solid #d3dce4;
      flex-grow: 1;
    }

    @keyframes shine {
      to {
        background-position-x: -200%;
      }
    }

    .general-card.loading .thumbnail {
      background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
      background-size: 200% 100%;
      animation: 1s shine linear infinite;
    }

    .general-card.loading h2 {
      background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
      background-size: 200% 100%;
      animation: 1s shine linear infinite;
    }
    .general-card.loading p {
      background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
      background-size: 200% 100%;
      animation: 1s shine linear infinite;
    }

    .title {
      font-size: 1.2rem;
      font-weight: 600;
      flex-grow: 1;
      flex-shrink: 0;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .meta p {
      display: flex;
      align-items: center;
      margin: 0;
    }

    .thumbnail {
      position: relative;
      display: block;
      width: 100%;
      margin: 0 auto;
      max-width: 170px;
      height: 170px;
      background-size: cover;
      background-position: 50% center;
    }

    .meta-icon {
      width: 16px;
      display: inline-block;
      margin-right: 5px;
    }

    #main {
      height: 100%;
      padding: 3px;
      box-sizing: border-box;
    }
  `;

  @property({ type: Boolean })
  private loading = false;
  @property({ type: String })
  private thumbnail: string = "";
  @property({ type: String })
  private url: string = "";
  @property({ type: String })
  private name: string = "Title";
  @property({ type: String })
  private date: string = "";
  @property({ type: String })
  private chapter: string = "";

  render() {
    console.log(this.loading);

    if (this.loading) {
      return html`
        <div id="main" part="container">
          <div class="general-card loading" part="event-card">
            <div part="thumbnail" class="thumbnail"></div>
            <h2 class="title"></h2>
            <div class="meta">
              <p class="chapter"></p>
              <p class="date"></p>
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div id="main" part="container">
        <div class="general-card" part="event-card" @click=${() => window.location.assign(this.url)}>
          <div
            class="thumbnail"
            part="thumbnail"
            style='background-image: url("${this.thumbnail}");'
          ></div>
          <h2 class="title">${this.name}</h2>
          <div class="meta">
            <p class="chapter">
              <span class="meta-icon icon-group">${BOOTSTRAP_GROUP}</span>${this
                .chapter}
            </p>
            <p class="date">
              <span class="meta-icon icon-calendar">${BOOTSTRAP_CALENDAR}</span
              >${this.date}
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "event-card": EventCard;
  }
}

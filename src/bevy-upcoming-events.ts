import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ResizeController } from "@lit-labs/observers/resize_controller.js";
import { ref, createRef } from "lit/directives/ref.js";
import { Task } from "@lit-labs/task";
import { upcomingEventsAPI, BevyEvent } from "./upcoming-events-api";

import {
  BOOTSTRAP_CHEVRON_LEFT,
  BOOTSTRAP_CHEVRON_RIGHT,
} from "./constants.js";

import "./event-card.js";
import "./slide-button.js";

@customElement("bevy-upcoming-events")
export class BevyUpcomingEvents extends LitElement {
  @property({ type: Number }) eventCardMinWidth = 285;
  @property({ type: String }) baseUrl = "https://gdg.community.dev/";
  @state() private events: BevyEvent[] = [];
  @state() prevContainerSize: number = -1;
  @state() totalEvents = 0;
  @state() offset = 0;
  @state() eventsOnScreen = 2;
  @state() cardWidth = this.eventCardMinWidth;

  containerRef = createRef<HTMLInputElement>();

  private _task = new Task<[baseUrl: string], BevyEvent[]>(
    this,
    async ([baseUrl]) => {
      try {
        const data = await upcomingEventsAPI(baseUrl);
        this.events = data.results;
        this.offset = 0;
        return this.events;
      } catch (err) {
        throw new Error(
          `Failed to fetch upcoming events from ${baseUrl}, ${err}`
        );
      }
    },
    () => [this.baseUrl]
  );

  static override styles = css`
    ::slotted(.slide-hidden) {
      display: none;
    }

    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    #container {
      flex-direction: row;
      overflow: hidden;
      display: inline-flex;
      flex-wrap: nowrap;
      width: 100%;
      position: relative;
    }
  `;

  private _resizeController = new ResizeController(this, {
    callback: (e) => {
      this.handleResize(e);
    },
  });

  public get resizeController() {
    return this._resizeController;
  }
  public set resizeController(value) {
    this._resizeController = value;
  }

  override render() {
    return html`<slide-button
        part="buttons left-buton"
        exportparts="internal-btn : buttons"
        @click=${this.navigateToPrevSlide}
      >
        ${BOOTSTRAP_CHEVRON_LEFT}
      </slide-button>

      <div part="container" ref=${ref(this.containerRef)} id="container">
        ${this._task.render({
          complete: (result: BevyEvent[]) => {
            const evts = result.slice(
              this.offset,
              this.offset + this.eventsOnScreen
            );
            return html`
              ${evts.map(
                (event) => html`
                  <event-card
                    style="min-width: ${this.cardWidth}px; width: ${this.cardWidth}px;"
                    exportparts="event-card : event-card, thumbnail : event-card-image, container : event-card-container"
                    name=${event.title}
                    date=${event.start_date.substring(0, 10)}
                    url=${event.url}
                    thumbnail=${event.picture.thumbnail_url || event.event_type_logo.thumbnail_url}
                    chapter=${event.chapter.title}
                  ></event-card>
                `
              )}
            </ul>
          `;
          },
          pending: () => html`
              ${[0, this.eventsOnScreen].map(
                () => html`<event-card ?loading=${true}></event-card>`
              )}
            </ul>
          `,
          error: (e: any) => html`<p>${e}</p>`,
        })}
      </div>

      <slide-button
        part="buttons right-buton"
        exportparts="internal-btn : buttons"
        @click=${this.navigateToNextSlide}
      >
        ${BOOTSTRAP_CHEVRON_RIGHT}
      </slide-button>`;
  }

  override firstUpdated() {
    const containerWidth = this.containerRef.value?.clientWidth;
    if (!containerWidth || this.prevContainerSize === containerWidth) return;
    this.resize(containerWidth);
  }

  navigateToNextSlide() {
    console.log(this.offset, this.eventsOnScreen, this.events.length);
    if (this.offset + this.eventsOnScreen < this.events.length) {
      this.offset += this.eventsOnScreen;
    }
  }

  navigateToPrevSlide() {
    if (this.offset - this.eventsOnScreen >= 0) {
      this.offset -= this.eventsOnScreen;
    }
  }

  resize(newWidth: number) {
    this.prevContainerSize = newWidth;
    this.eventsOnScreen = Math.max(
      1,
      Math.floor(newWidth / this.eventCardMinWidth)
    );
    this.cardWidth = newWidth / this.eventsOnScreen;
    this.offset = 0;
    console.log(newWidth, this.eventsOnScreen, this.cardWidth);
  }

  handleResize(roes: ResizeObserverEntry[]) {
    if (roes.length > 0) {
      const containerWidth = this.containerRef.value?.clientWidth;
      if (!containerWidth || this.prevContainerSize === containerWidth) return;
      this.resize(containerWidth);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bevy-upcoming-events": BevyUpcomingEvents;
  }
}

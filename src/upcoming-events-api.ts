interface Location {
  city: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

interface Picture {
  url: string;
  path: string;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_format: string;
  thumbnail_url: string;
}

interface Logo {
  url: string;
  path: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  thumbnail_format: string;
  thumbnail_url: string;
}

interface Chapter {
  chapter_location: string;
  city: string;
  country: string;
  country_name: string;
  description: string;
  id: number;
  hide_country_info: boolean;
  logo: Logo;
  state: string;
  timezone: string;
  title: string;
  relative_url: string;
  url: string;
}

interface EventTypeLogo {
  url: string;
  path: string;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_format: string;
  thumbnail_url: string;
}

export interface BevyEvent {
  id: number;
  title: string;
  description_short: string;
  picture: Picture;
  chapter: Chapter;
  city: string;
  start_date: string;
  url: string;
  relative_url: string;
  video_url?: any;
  event_type_title: string;
  event_type_logo: EventTypeLogo;
  tags: string[];
  allows_cohosting: boolean;
  result_type: string;
}

export interface UpcomingEventsAPIResponse {
  location: Location;
  results: BevyEvent[];
}

export async function upcomingEventsAPI(
  baseUrl: string
): Promise<UpcomingEventsAPIResponse> {
  return fetch(`${baseUrl}/api/search/?result_types=upcoming_event`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .catch((err) => {
      throw new Error(
        `Failed to fetch upcoming events from ${baseUrl}, ${err}`
      );
    });
}

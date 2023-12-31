import { MediaIntegrationFilter } from "../media-integrations/mediaIntegrationFilter"
import { MediaIntegration } from "./mediaIntegration"

export interface AppConfig {
    MEDIA_INTEGRATION_FILTERS: MediaIntegrationFilter[]
    MEDIA_INTEGRATIONS: MediaIntegration[]
    DISCORD_TOKEN: string,
    DISCORD_CLIENT_ID: string,
    USER_ID: string,
    THREAD_ID: string,
    COOKIES_FILE_PATH: string,
    MESKA_SRODA_DISCORD_CHANNEL_ID: string,
    WEBHOOK_TOKEN: string
  }
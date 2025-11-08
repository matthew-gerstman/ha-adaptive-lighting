import { CreateApplication } from "@digital-alchemy/core";
import { LIB_HASS } from "@digital-alchemy/hass";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";
import { LIB_AUTOMATION } from "@digital-alchemy/automation";
import { AdaptiveLightingService } from "./services/adaptive-lighting.js";

const APP = CreateApplication({
  name: "adaptive_lighting",
  libraries: [LIB_HASS, LIB_SYNAPSE, LIB_AUTOMATION],
  services: {
    adaptive_lighting: AdaptiveLightingService,
  },
});

await APP.bootstrap();

// Main images
import Wyze_Battery_Cam_Pro from '@/assets/images/products/Wyze_Battery_Cam_Pro.png'
import Wyze_Cam_Floodlight_v2 from '@/assets/images/products/Wyze_Cam_Floodlight_v2.png'
import Wyze_Cam_Pan_v3 from '@/assets/images/products/Wyze_Cam_Pan_v3.png'
import Wyze_Cam_v4 from '@/assets/images/products/Wyze_Cam_v4.png'
import Wyze_Duo_Cam_Doorbell from '@/assets/images/products/Wyze_Duo_Cam_Doorbell.png'
import Wyze_Sense_Motion_Sensor from '@/assets/images/products/Wyze_Sense_Motion_Sensor.png'
import Wyze_Sense_Hub from '@/assets/images/products/Wyze_Sense_Hub.png'
import Wyze_MicroSD_Card_256GB from '@/assets/images/products/Wyze_MicroSD_Card_256GB.png'
import Cam_Unlimited from '@/assets/images/products/Cam_Unlimited.png'
import Cam_Plus from '@/assets/images/products/Cam_Plus.png'

// Camera variants
import Wyze_Battery_Cam_Pro_white from '@/assets/images/products/Wyze_Battery_Cam_Pro_white.png'
import Wyze_Battery_Cam_Pro_black from '@/assets/images/products/Wyze_Battery_Cam_Pro_black.png'
import Wyze_Cam_Floodlight_v2_white from '@/assets/images/products/Wyze_Cam_Floodlight_v2_white.png'
import Wyze_Cam_Floodlight_v2_black from '@/assets/images/products/Wyze_Cam_Floodlight_v2_black.png'
import Wyze_Cam_Pan_v3_white from '@/assets/images/products/Wyze_Cam_Pan_v3_white.png'
import Wyze_Cam_Pan_v3_black from '@/assets/images/products/Wyze_Cam_Pan_v3_black.png'
import Wyze_Cam_v4_white from '@/assets/images/products/Wyze_Cam_v4_white.png'
import Wyze_Cam_v4_grey from '@/assets/images/products/Wyze_Cam_v4_grey.png'
import Wyze_Cam_v4_black from '@/assets/images/products/Wyze_Cam_v4_black.png'

export const PRODUCT_IMAGES: Record<string, string> = {
  'wyze-cam-v4': Wyze_Cam_v4,
  'wyze-cam-pan-v3': Wyze_Cam_Pan_v3,
  'wyze-cam-floodlight-v2': Wyze_Cam_Floodlight_v2,
  'wyze-duo-cam-doorbell': Wyze_Duo_Cam_Doorbell,
  'wyze-battery-cam-pro': Wyze_Battery_Cam_Pro,
  'wyze-sense-motion-sensor': Wyze_Sense_Motion_Sensor,
  'wyze-sense-hub': Wyze_Sense_Hub,
  'wyze-microsd-card-256gb': Wyze_MicroSD_Card_256GB,
  'cam-unlimited-plan': Cam_Unlimited,
  'cam-plus-plan': Cam_Plus,
}

export const VARIANT_IMAGES: Record<string, Record<string, string>> = {
  'wyze-cam-v4': {
    'white': Wyze_Cam_v4_white,
    'grey': Wyze_Cam_v4_grey,
    'black': Wyze_Cam_v4_black,
  },
  'wyze-cam-pan-v3': {
    'white': Wyze_Cam_Pan_v3_white,
    'black': Wyze_Cam_Pan_v3_black,
  },
  'wyze-cam-floodlight-v2': {
    'white': Wyze_Cam_Floodlight_v2_white,
    'black': Wyze_Cam_Floodlight_v2_black,
  },
  'wyze-battery-cam-pro': {
    'white': Wyze_Battery_Cam_Pro_white,
    'black': Wyze_Battery_Cam_Pro_black,
  },
}

export function getProductImage(productId: string, variantId?: string): string {
  if (variantId && VARIANT_IMAGES[productId]?.[variantId]) {
    return VARIANT_IMAGES[productId][variantId]
  }
  return PRODUCT_IMAGES[productId] || ''
}

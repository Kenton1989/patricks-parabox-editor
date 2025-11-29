import { definePreset } from '@primeuix/themes'
import Material from '@primeuix/themes/material'

const MyPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
    formField: {
      sm: {
        fontSize: '0.875rem',
        paddingX: '0.25rem',
        paddingY: '0.25rem',
      },
    },
    navigation: {
      item: {
        padding: '0.5rem 1rem',
      },
    },
  },
  components: {
    button: {
      root: {
        sm: {
          iconOnlyWidth: '2rem',
        },
      },
    },
  },
})

export default MyPreset

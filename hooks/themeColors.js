
import { useColorScheme } from 'react-native';

const Colors = {
  light: {
    primary: "#675D9D",
    background: "#E6E6E6",
    textPrimary: "#333333",
    textSecondary: "#999999",
    surfaceBase: "#FFFFFF",
    surfaceCard: "#F7F7F7",
  },
  dark: {
    primary: "#675D9D",
    background: "#101010",
    textPrimary: "#E1E1E1",
    textSecondary: "#A0A0A0",
    surfaceBase: "#181818",
    surfaceCard: "#242424",

  },
}

const useThemeColors = () => {
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme]

  return colors
}

export default useThemeColors

/*
| Color Name      | Main Color | Light Mode | Dark Mode |
|-----------------|------------|------------|-----------|
| Primary         | 675D9D     | #675D9D    | #675D9D   |
| Surface-Base    | FFFFFF     | #FFFFFF    | #181818   |
| Surface-Card    | F7F7F7     | #F7F7F7    | #242424   |
| Surface-Raised  | FFFFFF     | #FFFFFF    | #2E2E2E   |
| Surface-Elevate | FFFFFF     | #FFFFFF    | #3A3A3A   |
| Text-Primary    | 000000     | #333333    | #E0E0E0   |
| Text-Secondary  | 6D6D6D     | #999999    | #A0A0A0   |
| Accent          | FF4081     | #FF4081    | #FF5577   |
| Background      | F2F2F2     | #F2F2F2    | #101010   |
| Border          | D1D1D1     | #E5E5E5    | #1C1C1C   |
| Neutral-0       | FFFFFF     | #FFFFFF    | #000000   |
| Neutral-100     | E0E0E0     | #E0E0E0    | #1A1A1A   |
| Neutral-200     | C0C0C0     | #C0C0C0    | #333333   |
| Primary-Soft    | 837FB2     | #837FB2    | #514E6A   |
| Const-White     | FFFFFF     | #FFFFFF    | #FFFFFF   |
| Const-Primary   | 675D9D     | #675D9D    | #675D9D   |
| Const-Gray-800  | 333333     | #333333    | #333333   |

*/
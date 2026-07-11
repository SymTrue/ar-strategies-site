# AnimatedGradient Component Integration Guide

## ✅ Installation Complete

The `AnimatedGradient` WebGL-based component has been successfully integrated into your AR Strategies website.

### Files Created
- ✅ `/app/components/ui/animated-gradient.tsx` — Main component
- ✅ `/app/components/ui/animated-gradient-utils/webgl-error-boundary.tsx` — Error boundary & fallback
- ✅ `/app/components/ui/animated-gradient-demo.tsx` — Demo component
- ✅ `/lib/utils.ts` — Utility functions (cn helper)

### Dependencies Installed
- ✅ `tailwind-merge` — For merging Tailwind CSS classes

## Usage

### Basic Usage

```tsx
import { AnimatedGradient } from "@/components/ui/animated-gradient";

export default function MyComponent() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl">
      <AnimatedGradient config={{ preset: "Aurora" }} radius="12px" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Your Content</h1>
      </div>
    </div>
  );
}
```

### Props

#### `config` (Optional)
Define the gradient style using presets or custom configuration.

**Presets:**
- `Aurora` — Deep purple/magenta gradient (default)
- `Oceanic` — Dark blue/cyan gradient
- `Amber` — Orange/warm gradient
- `Toxic` — Neon green gradient
- `Ghost` — Grayscale gradient

**Using a Preset:**
```tsx
<AnimatedGradient config={{ preset: "Oceanic" }} />
```

**Custom Configuration:**
```tsx
<AnimatedGradient
  config={{
    preset: "custom",
    color1: "#0a001a",
    color2: "#1a0b2e",
    color3: "#f20089",
    rotation: -45,
    proportion: 60,
    scale: 0.6,
    speed: 15,
    distortion: 40,
    swirl: 80,
    swirlIterations: 10,
    softness: 100,
    offset: 200,
    shape: "Edge",
    shapeSize: 50,
  }}
/>
```

#### `noise` (Optional)
Add a grainy texture overlay.

```tsx
<AnimatedGradient
  config={{ preset: "Aurora" }}
  noise={{ opacity: 0.5, scale: 1 }}
/>
```

#### `radius` (Optional)
Set border radius (default: "0px").

```tsx
<AnimatedGradient radius="12px" />
```

#### `className` (Optional)
Add custom CSS classes.

```tsx
<AnimatedGradient className="rounded-lg" />
```

#### `style` (Optional)
Add inline CSS styles.

```tsx
<AnimatedGradient style={{ filter: "blur(10px)" }} />
```

## Performance Considerations

✅ **Hardware Accelerated** — Uses WebGL 2.0 for smooth 60fps animation
✅ **Responsive** — Auto-resizes to container using ResizeObserver
✅ **Memory Efficient** — Cleans up resources on unmount
✅ **Fallback Support** — Gracefully falls back to static gradient on WebGL error

## Browser Support

- ✅ Chrome/Edge 75+
- ✅ Firefox 72+
- ✅ Safari 16.4+
- ✅ Mobile browsers (iOS 16.4+, Android 9+)

## Integration Ideas

### 1. Hero Section Background
```tsx
<div className="relative min-h-screen">
  <AnimatedGradient config={{ preset: "Aurora" }} />
  <div className="relative z-10">
    {/* Hero content */}
  </div>
</div>
```

### 2. Card Backgrounds
```tsx
<div className="relative rounded-lg overflow-hidden h-64">
  <AnimatedGradient config={{ preset: "Oceanic", speed: 10 }} radius="8px" />
  <div className="relative z-10 p-6">
    {/* Card content */}
  </div>
</div>
```

### 3. Feature Showcase
```tsx
<div className="relative h-96 rounded-2xl overflow-hidden">
  <AnimatedGradient 
    config={{ preset: "Amber" }} 
    noise={{ opacity: 0.3 }}
    radius="16px"
  />
  <div className="relative z-10 flex items-center justify-center h-full">
    <div className="text-center text-white">
      <h2 className="text-3xl font-bold mb-4">Feature Title</h2>
      <p className="text-lg opacity-90">Feature description</p>
    </div>
  </div>
</div>
```

## Custom Gradient Configuration

### Parameters

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| `color1` | Hex/RGB | varies | Primary gradient color |
| `color2` | Hex/RGB | varies | Secondary gradient color |
| `color3` | Hex/RGB | varies | Tertiary gradient color |
| `rotation` | -180 to 180 | 0 | Gradient rotation in degrees |
| `proportion` | 0-100 | 60 | Color distribution |
| `scale` | 0-2 | 0.6 | Overall scale |
| `speed` | 0-100 | 15 | Animation speed |
| `distortion` | 0-100 | 40 | Wave distortion |
| `swirl` | 0-100 | 80 | Swirl effect intensity |
| `swirlIterations` | 1-30 | 10 | Swirl complexity |
| `softness` | 0-100 | 100 | Edge softness |
| `offset` | Any | 0 | Time offset |
| `shape` | "Checks" \| "Stripes" \| "Edge" | "Edge" | Pattern shape |
| `shapeSize` | 0-100 | 50 | Pattern size |

## Troubleshooting

### WebGL Not Supported
If WebGL 2.0 is not available, the component gracefully falls back to a static gradient.

### Performance Issues
- Reduce animation speed: `speed: 5`
- Disable noise: `noise: undefined`
- Reduce swirl iterations: `swirlIterations: 5`

### Colors Not Showing
- Ensure colors are valid hex (#RRGGBB) or RGB format
- Test with preset: `preset: "Aurora"`
- Check z-index of content overlay (should be > 0)

## Accessibility

✅ Animated gradients are background-only and don't block content interaction
✅ Respects `prefers-reduced-motion` through Framer Motion settings
✅ Content is always readable over the gradient with proper z-index layering

## Next Steps

1. **Hero Section** — Replace current hero with AnimatedGradient
2. **Feature Cards** — Add to Why Us / Process sections
3. **CTA Buttons** — Use as button background hovers
4. **Custom Presets** — Create brand-specific gradient configs

## Support

For issues or questions about the component, refer to:
- Component code: `/app/components/ui/animated-gradient.tsx`
- Error boundary: `/app/components/ui/animated-gradient-utils/webgl-error-boundary.tsx`
- Build status: `npm run build`

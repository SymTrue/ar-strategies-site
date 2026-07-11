# LiquidMetal Component Integration Guide

## ✅ Installation Complete

The `LiquidMetal` WebGL-based liquid metal effect component has been successfully integrated from `@paper-design/shaders-react`.

### Files Created
- ✅ `/app/components/ui/liquid-metal.tsx` — Component wrapper & exports
- ✅ `/app/components/ui/liquid-metal-demo.tsx` — Interactive demo with full controls
- ✅ Dependencies: `@paper-design/shaders-react`

## Overview

LiquidMetal is an advanced WebGL component that creates stunning liquid metal distortion effects. It supports:
- Multiple animated liquid shapes (circle, daisy, diamond, metaballs, none)
- Full image processing with real-time parameter adjustment
- 16+ customizable parameters
- Pre-built presets for quick styling
- Custom image uploads for effect application

## Basic Usage

### Minimal Setup
```tsx
import LiquidMetal from "@/components/ui/liquid-metal";
import { liquidMetalPresets } from "@/components/ui/liquid-metal";

export default function HeroSection() {
  const preset = liquidMetalPresets[0]; // Use first preset
  
  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      <LiquidMetal 
        {...preset.params}
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Your Content</h1>
      </div>
    </div>
  );
}
```

### With Image
```tsx
<LiquidMetal
  {...params}
  image={imageElement}
  style={{ width: "100%", height: "100%" }}
  suspendWhenProcessingImage
/>
```

## Parameters

### Color Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `colorBack` | hex | varies | Background color |
| `colorTint` | hex | varies | Tint color overlay |

### Shape & Pattern
| Parameter | Type | Options | Description |
|-----------|------|---------|-------------|
| `shape` | string | "none", "circle", "daisy", "diamond", "metaballs" | Liquid distortion pattern |
| `repetition` | number | 1-10 | Pattern repetition count |
| `softness` | number | 0-1 | Edge softness (0=sharp, 1=soft) |

### Distortion
| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `shiftRed` | number | -1 to 1 | Red channel shift |
| `shiftBlue` | number | -1 to 1 | Blue channel shift |
| `distortion` | number | 0-1 | Overall distortion amount |
| `contour` | number | 0-1 | Contour/edge definition |

### Animation & Transform
| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `angle` | number | 0-360 | Rotation angle in degrees |
| `speed` | number | 0-4 | Animation speed multiplier |
| `scale` | number | 0.2-4 | Effect scale |
| `rotation` | number | 0-360 | Pattern rotation |
| `offsetX` | number | -1 to 1 | Horizontal offset |
| `offsetY` | number | -1 to 1 | Vertical offset |
| `fit` | string | "contain", "cover" | Image fit mode |

## Available Presets

Access presets from `liquidMetalPresets`:
```tsx
import { liquidMetalPresets } from "@/components/ui/liquid-metal";

liquidMetalPresets.map(preset => ({
  name: preset.name,
  params: preset.params
}))
```

Common presets include:
- **Abstract** — Contemporary liquid art effect
- **Organic** — Natural flowing patterns
- **Psychedelic** — Vibrant color shifting
- **Minimal** — Subtle distortion
- **Metallic** — Chrome/metal look

## Interactive Demo Component

Use the full demo with all controls:

```tsx
import LiquidMetalDemo from "@/components/ui/liquid-metal-demo";

export default function DemoPage() {
  return <LiquidMetalDemo />;
}
```

The demo includes:
- ✅ All 16+ parameter sliders
- ✅ Color pickers for colorBack & colorTint
- ✅ Shape selector
- ✅ Fit mode selector
- ✅ Preset buttons
- ✅ Image upload capability
- ✅ Real-time parameter adjustment

## Integration Ideas

### 1. Hero Section Background
```tsx
<section className="relative min-h-screen overflow-hidden">
  <LiquidMetal 
    {...liquidMetalPresets[0].params}
    style={{ 
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    }}
  />
  <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
    <h1 className="text-5xl font-bold text-white mb-6">Perception Meets Intelligence</h1>
    <p className="text-xl text-gray-200 mb-8">How brands become impossible to ignore</p>
  </div>
</section>
```

### 2. Feature Card Background
```tsx
<div className="relative h-64 rounded-xl overflow-hidden group">
  <LiquidMetal
    {...liquidMetalPresets[2].params}
    style={{ width: "100%", height: "100%" }}
  />
  <div className="absolute inset-0 z-10 bg-black/40 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center text-center p-6">
    <h3 className="text-2xl font-bold text-white mb-2">Feature Title</h3>
    <p className="text-sm text-gray-200">Feature description goes here</p>
  </div>
</div>
```

### 3. Dynamic Effect on Scroll
```tsx
"use client";

import { useState, useEffect } from "react";
import LiquidMetal from "@/components/ui/liquid-metal";

export default function ScrollEffect() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-96 overflow-hidden rounded-lg">
      <LiquidMetal
        angle={scroll * 0.5}
        offsetY={scroll * 0.01}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
```

### 4. With Custom Image
```tsx
"use client";

import { useState } from "react";
import LiquidMetal from "@/components/ui/liquid-metal";

export default function ImageWithEffect() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "https://images.unsplash.com/photo-...";
    img.onload = () => setImage(img);
  }, []);

  return (
    <LiquidMetal
      {...liquidMetalPresets[1].params}
      image={image}
      style={{ width: "100%", height: "100%" }}
      suspendWhenProcessingImage
    />
  );
}
```

## Custom Configuration

Create your own preset:
```tsx
const customEffect = {
  colorBack: "#0a0a0a",
  colorTint: "#ff6b35",
  shape: "metaballs",
  repetition: 3,
  softness: 0.8,
  shiftRed: 0.2,
  shiftBlue: -0.1,
  distortion: 0.6,
  contour: 0.4,
  angle: 45,
  speed: 1.5,
  scale: 1.2,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  fit: "cover"
};

<LiquidMetal {...customEffect} style={{ width: "100%", height: "100%" }} />
```

## Performance Considerations

✅ **Hardware Accelerated** — Uses WebGL for smooth rendering
✅ **Responsive** — Automatically scales to container
✅ **Suspense-Aware** — Built-in support for React Suspense
✅ **Optional Image Processing** — `suspendWhenProcessingImage` flag
✅ **Memory Efficient** — Cleans up resources appropriately

## Browser Support

- ✅ Chrome/Edge 75+ (WebGL 2.0)
- ✅ Firefox 72+
- ✅ Safari 16.4+
- ✅ Modern mobile browsers

## Troubleshooting

### Image Not Processing
- Ensure image is fully loaded before passing to LiquidMetal
- Use `suspendWhenProcessingImage` for async image loading
- Check CORS if using external images

### Performance Issues
- Reduce `speed` parameter
- Lower `repetition` count
- Use smaller images
- Disable effects on mobile if needed

### Colors Not Updating
- Verify hex color format (#RRGGBB)
- Check that colorBack and colorTint are set
- Try using a preset first

## Advanced: Custom Preset Export

```tsx
export const myPreset = {
  name: "MyCustomPreset",
  params: {
    colorBack: "#1a1a1a",
    colorTint: "#ea580c",
    shape: "circle",
    // ... all other params
  }
};
```

## API Reference

### Props
```tsx
interface LiquidMetalProps {
  // Color
  colorBack?: string;
  colorTint?: string;
  
  // Pattern
  shape?: "none" | "circle" | "daisy" | "diamond" | "metaballs";
  repetition?: number;
  softness?: number;
  
  // Distortion
  shiftRed?: number;
  shiftBlue?: number;
  distortion?: number;
  contour?: number;
  
  // Animation
  angle?: number;
  speed?: number;
  scale?: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  fit?: "contain" | "cover";
  
  // Image
  image?: HTMLImageElement | string;
  suspendWhenProcessingImage?: boolean;
  
  // Styling
  style?: CSSProperties;
  className?: string;
}
```

## Next Steps

1. **Integration** — Add to hero section or feature cards
2. **A/B Testing** — Test different presets with users
3. **Custom Presets** — Create brand-specific effects
4. **Scroll Animations** — Tie effects to scroll position
5. **Image Integration** — Apply effects to testimonial images

## Resources

- Component: `/app/components/ui/liquid-metal.tsx`
- Demo: `/app/components/ui/liquid-metal-demo.tsx`
- Source: `@paper-design/shaders-react`
- Build Status: ✅ All tests passing

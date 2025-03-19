import { useState, useEffect, useCallback } from "react";
import { Copy, RefreshCw, Lock, Unlock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "../hooks/useToast";

interface ColorInfo {
  id: number;
  hex: string;
  isLocked: boolean;
}

type ColorFormat = "hex" | "rgb" | "hsl";

export default function ColorPaletteGenerator() {
  const { toast } = useToast();
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [colorFormat, setColorFormat] = useState<ColorFormat>("hex");

  // Generate a random hex color
  const generateRandomHex = useCallback(() => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }, []);

  // Generate random colors, preserving locked ones
  const generateColors = useCallback(() => {
    setColors((prevColors) =>
      Array(5)
        .fill(null)
        .map((_, index) => {
          const existingColor = prevColors[index];

          if (existingColor && existingColor.isLocked) {
            return existingColor;
          }

          return {
            id: existingColor?.id || Date.now() + index,
            hex: generateRandomHex(),
            isLocked: false,
          };
        }),
    );
  }, [generateRandomHex]);

  // Generate initial colors on first render
  useEffect(() => {
    generateColors();
  }, [generateColors]);

  // Handle spacebar press to generate new colors
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        generateColors();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generateColors]);

  // Toggle lock state for a color
  const toggleLock = useCallback((id: number) => {
    setColors((prevColors) =>
      prevColors.map((color) =>
        color.id === id ? { ...color, isLocked: !color.isLocked } : color,
      ),
    );
  }, []);

  // Convert hex to RGB format
  const hexToRgb = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  // Convert hex to HSL format
  const hexToHsl = useCallback((hex: string) => {
    // Convert hex to RGB first
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    // Find greatest and smallest channel values
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    // Calculate hue
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Convert to percentages
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `hsl(${h}, ${s}%, ${l}%)`;
  }, []);

  // Get color value based on selected format
  const getColorValue = useCallback(
    (hex: string) => {
      switch (colorFormat) {
        case "rgb":
          return hexToRgb(hex);
        case "hsl":
          return hexToHsl(hex);
        default:
          return hex;
      }
    },
    [colorFormat, hexToRgb, hexToHsl],
  );

  // Copy color to clipboard
  const copyToClipboard = useCallback(
    (color: string) => {
      navigator.clipboard.writeText(color);
      toast({
        title: "Color copied!",
        description: `${color} has been copied to clipboard`,
        duration: 2000,
      });
    },
    [toast],
  );

  // Determine if text should be light or dark based on background color
  const getTextColor = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Calculate perceived brightness (YIQ formula)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "text-black" : "text-white";
  }, []);

  const handleFormatChange = useCallback((value: string) => {
    setColorFormat(value as ColorFormat);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center !mb-12">
          <h1 className="text-3xl font-bold mb-2">Color Palette Generator</h1>
          <p className="text-muted-foreground mb-4">
            Press the spacebar or click the refresh button to generate a new
            palette
          </p>

          <div className="flex justify-center gap-4 mb-6">
            <Tabs value={colorFormat}>
              <TabsList>
                <TabsTrigger onValueChange={handleFormatChange} value="hex">
                  HEX
                </TabsTrigger>
                <TabsTrigger onValueChange={handleFormatChange} value="rgb">
                  RGB
                </TabsTrigger>
                <TabsTrigger onValueChange={handleFormatChange} value="hsl">
                  HSL
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              onClick={generateColors}
              variant="outline"
              className="gap-2 !px-5"
            >
              <RefreshCw className="h-4 " />
              Generate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {colors.map((color) => (
            <Card key={color.id} className="overflow-hidden">
              <div
                className="h-40 flex items-center justify-center relative"
                style={{ backgroundColor: color.hex }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className={`absolute top-2 right-2 bg-white/10 backdrop-blur-sm ${getTextColor(color.hex)}`}
                  onClick={() => toggleLock(color.id)}
                >
                  {color.isLocked ? (
                    <Lock className="h-4 w-4 text-black" />
                  ) : (
                    <Unlock className="text-black h-4 w-4" />
                  )}
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm truncate">
                    {getColorValue(color.hex)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(getColorValue(color.hex))}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="!mt-8 text-center text-sm text-muted-foreground">
          <p>
            Tip: Lock colors you want to keep before generating a new palette
          </p>
        </div>
      </div>
    </div>
  );
}

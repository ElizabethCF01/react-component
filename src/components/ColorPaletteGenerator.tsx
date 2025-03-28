import { useState, useEffect, useCallback } from "react";
import { Copy, RefreshCw, Lock, Unlock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "../hooks/useToast";
import { hexToRgb, hexToHsl, generateRandomHex } from "../utils/colorUtils";
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
  }, []);

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
    [colorFormat],
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
              name="generate"
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
                data-testid={`color-box-${color.id}`}
                className="h-40 flex items-center justify-center relative"
                style={{ backgroundColor: color.hex }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className={`absolute top-2 right-2 bg-white/10 backdrop-blur-sm ${getTextColor(color.hex)}`}
                  onClick={() => toggleLock(color.id)}
                  data-testid={`lock-button-${color.id}`}
                >
                  {color.isLocked ? (
                    <Lock className="h-4 w-4 text-black" />
                  ) : (
                    <Unlock className="text-black h-4 w-4" />
                  )}
                </Button>
              </div>
              <CardContent className=" p-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm truncate">
                    {getColorValue(color.hex)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Copy color"
                    title="Copy color"
                    data-testid={`copy-button-${color.id}`}
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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, test, vi} from "vitest";
import ColorPaletteGenerator from "../src/components/ColorPaletteGenerator.tsx";
import { ToastProvider } from '../src/components/ToasterProvider';
import React from "react";

beforeAll(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: vi.fn(), // Mock de la función clipboard.writeText
    },
    writable: true,
  });
});

describe("ColorPaletteGenerator", () => {
  test("copy color to clipboard", async () => {
    const writeTextMock = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();

    render(
      <ToastProvider>
        <ColorPaletteGenerator />
      </ToastProvider>
    );

    const copyButton = screen.getAllByRole("button", { name: /copy/i })[0];

    await userEvent.click(copyButton);
    expect(writeTextMock).toHaveBeenCalled();

    writeTextMock.mockRestore();
  });
});

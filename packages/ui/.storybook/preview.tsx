import * as React from "react";
import type { Preview } from "@storybook/react-vite";
import "./storybook.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
  globalTypes: {
    theme: {
      description: "Colour theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      const dark = context.globals.theme === "dark";
      React.useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
      }, [dark]);
      return <Story />;
    },
  ],
};

export default preview;

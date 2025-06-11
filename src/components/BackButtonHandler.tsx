// BackButtonHandler.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";

export function BackButtonHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    let backHandler: PluginListenerHandle;

    const setupBackButton = async () => {
      backHandler = await CapacitorApp.addListener("backButton", () => {
        navigate(-1);
      });
    };

    setupBackButton();

    return () => {
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [navigate]);

  return null;
}

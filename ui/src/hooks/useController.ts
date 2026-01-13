import { useState, useEffect, useCallback } from "react";
import { useConnect, useAccount } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";

export const useConnectedController = () => {
  const { connector } = useConnect();

  if (connector instanceof ControllerConnector) {
    return connector;
  }

  return null;
};

export const useControllerProfile = () => {
  const { account } = useAccount();
  const controllerConnector = useConnectedController();

  const openProfile = async () => {
    if (account && controllerConnector) {
      await controllerConnector.controller.openProfile();
    }
  };

  return {
    openProfile,
  };
};

export const useControllerUsername = () => {
  const { address } = useAccount();
  const [username, setUsername] = useState<string | undefined>(undefined);
  const controllerConnector = useConnectedController();

  const getUsername = useCallback(async () => {
    if (!controllerConnector?.controller) return;
    try {
      const username = await controllerConnector.username();
      setUsername(username || "");
    } catch (error) {
      console.error("Failed to fetch username:", error);
      setUsername(undefined);
    }
  }, [controllerConnector, address]);

  useEffect(() => {
    getUsername();
  }, [getUsername, address]);

  return {
    username,
  };
};

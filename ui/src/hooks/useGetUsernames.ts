import { useState, useEffect, useMemo } from "react";
import { lookupAddresses } from "@cartridge/controller";

export const useGetUsernames = (addresses: string[]) => {
  const [usernames, setUsernames] = useState<Map<string, string> | undefined>(
    undefined
  );

  const addressesKey = useMemo(() => {
    return addresses.join(",");
  }, [addresses]);

  const fetchUsernames = async () => {
    if (addresses.length === 0) return;
    const addressMap = await lookupAddresses(addresses);
    setUsernames(addressMap);
  };

  useEffect(() => {
    fetchUsernames();
  }, [addressesKey]);

  return {
    usernames,
    refetch: fetchUsernames,
  };
};

import cockpit from "cockpit";
import { useState, useEffect } from "react";

export function usePageLocation(): cockpit.Location {
    const [location, setLocation] = useState(cockpit.location);

    useEffect(() => {
        function handleLocationChanged() {
            setLocation({ ...cockpit.location });
        }
        cockpit.addEventListener("locationchanged", handleLocationChanged);
        return () => {
            cockpit.removeEventListener("locationchanged", handleLocationChanged);
        };
    }, []);

    return location;
}

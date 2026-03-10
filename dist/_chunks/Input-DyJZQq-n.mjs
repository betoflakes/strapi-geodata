import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { Field, Box, TextInput, Button, Typography, Accordion, JSONInput } from "@strapi/design-system";
import "leaflet/dist/leaflet.css";
import { useField } from "@strapi/strapi/admin";
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
const customIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowUrl,
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});
const mapProps = {
  zoom: 7,
  center: [41.9, 12.5],
  tileUrl: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  tileAttribution: "OSM attribution",
  tileAccessToken: ""
};
const Input = ({ hint, labelAction, label, name, required, ...props }) => {
  const field = useField(name);
  const [map, setMap] = useState(null);
  const [location, _setLocation] = useState(props.value);
  const searchRef = useRef(null);
  const onMapClick = useCallback(
    (e) => {
      let lat = parseFloat(e.latlng.lat.toString());
      let lng = parseFloat(e.latlng.lng.toString());
      onSetLocation({ lat, lng });
    },
    []
  );
  useEffect(() => {
    if (!map) return;
    map.on("contextmenu", onMapClick);
    return () => {
      map.off("contextmenu", onMapClick);
    };
  }, [map, onMapClick]);
  useEffect(() => {
    field.onChange(name, location);
  }, [location]);
  async function searchLocation(e) {
    let search = searchRef.current?.value;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${search}&format=jsonv2`
    );
    const data = await response.json();
    if (data.length > 0) {
      let lat = parseFloat(data[0].lat);
      let lng = parseFloat(data[0].lon);
      onSetLocation({ lat, lng });
      map.panTo({ lat, lng });
    }
  }
  const onSetLocation = ({ lat, lng }) => {
    _setLocation({ lat, lng });
  };
  const marginBottom = "1.5rem";
  const marginTop = "0.5rem";
  const display = "block";
  return /* @__PURE__ */ jsx(Field.Root, { error: props.error, name, id: name, hint, required, children: /* @__PURE__ */ jsxs(Box, { children: [
    /* @__PURE__ */ jsx(Field.Label, { action: labelAction, style: { marginBottom }, children: label }),
    /* @__PURE__ */ jsxs(Box, { style: { display: "grid", gridTemplateColumns: "4fr 1fr", gap: "8px" }, children: [
      /* @__PURE__ */ jsx(TextInput, { ref: searchRef, name: "search", placeholder: "Address to search" }),
      /* @__PURE__ */ jsx(Button, { onClick: searchLocation, size: "L", children: "Search" })
    ] }),
    /* @__PURE__ */ jsx(Typography, { variant: "pi", style: { marginBottom, display, marginTop }, children: "To set the location search for an address and press 'Search', or navigate on the map and right-click" }),
    /* @__PURE__ */ jsx(Box, { style: { display: "flex", height: "300px", width: "100%" }, children: /* @__PURE__ */ jsx(Box, { style: { width: "100% " }, children: /* @__PURE__ */ jsxs(
      MapContainer,
      {
        zoom: mapProps.zoom,
        center: props.value?.lat && props.value?.lng ? [props.value?.lat, props.value?.lng] : mapProps.center,
        ref: setMap,
        style: { height: "300px", zIndex: 299 },
        children: [
          /* @__PURE__ */ jsx(
            TileLayer,
            {
              attribution: mapProps.tileAttribution,
              url: mapProps.tileUrl,
              accessToken: mapProps.tileAccessToken
            }
          ),
          location && /* @__PURE__ */ jsx(Marker, { position: [location?.lat, location?.lng], icon: customIcon })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx(Accordion.Root, { children: /* @__PURE__ */ jsxs(Accordion.Item, { value: `acc-${name}`, children: [
      /* @__PURE__ */ jsx(Accordion.Header, { children: /* @__PURE__ */ jsx(Accordion.Trigger, { description: "Coordinate", children: "Coordinate" }) }),
      /* @__PURE__ */ jsx(Accordion.Content, { children: /* @__PURE__ */ jsx(
        JSONInput,
        {
          disabled: true,
          name: props.name,
          value: typeof field.value == "object" ? JSON.stringify(field.value, null, 2) : field.value,
          onChange: (e) => onSetLocation(e),
          style: { height: "9rem" }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(Field.Hint, {}),
    /* @__PURE__ */ jsx(Field.Error, {})
  ] }) });
};
export {
  Input as default
};

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const react = require("react");
const reactLeaflet = require("react-leaflet");
const L = require("leaflet");
const designSystem = require("@strapi/design-system");
require("leaflet/dist/leaflet.css");
const admin = require("@strapi/strapi/admin");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const L__default = /* @__PURE__ */ _interopDefault(L);
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
const customIcon = new L__default.default.Icon({
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
  const field = admin.useField(name);
  const [map, setMap] = react.useState(null);
  const [location, _setLocation] = react.useState(props.value);
  const searchRef = react.useRef(null);
  const onMapClick = react.useCallback(
    (e) => {
      let lat = parseFloat(e.latlng.lat.toString());
      let lng = parseFloat(e.latlng.lng.toString());
      onSetLocation({ lat, lng });
    },
    []
  );
  react.useEffect(() => {
    if (!map) return;
    map.on("contextmenu", onMapClick);
    return () => {
      map.off("contextmenu", onMapClick);
    };
  }, [map, onMapClick]);
  react.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Root, { error: props.error, name, id: name, hint, required, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Label, { action: labelAction, style: { marginBottom }, children: label }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { style: { display: "grid", gridTemplateColumns: "4fr 1fr", gap: "8px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.TextInput, { ref: searchRef, name: "search", placeholder: "Address to search" }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { onClick: searchLocation, size: "L", children: "Search" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", style: { marginBottom, display, marginTop }, children: "To set the location search for an address and press 'Search', or navigate on the map and right-click" }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { style: { display: "flex", height: "300px", width: "100%" }, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { style: { width: "100% " }, children: /* @__PURE__ */ jsxRuntime.jsxs(
      reactLeaflet.MapContainer,
      {
        zoom: mapProps.zoom,
        center: props.value?.lat && props.value?.lng ? [props.value?.lat, props.value?.lng] : mapProps.center,
        ref: setMap,
        style: { height: "300px", zIndex: 299 },
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            reactLeaflet.TileLayer,
            {
              attribution: mapProps.tileAttribution,
              url: mapProps.tileUrl,
              accessToken: mapProps.tileAccessToken
            }
          ),
          location && /* @__PURE__ */ jsxRuntime.jsx(reactLeaflet.Marker, { position: [location?.lat, location?.lng], icon: customIcon })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Accordion.Root, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Accordion.Item, { value: `acc-${name}`, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Accordion.Header, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Accordion.Trigger, { description: "Coordinate", children: "Coordinate" }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Accordion.Content, { children: /* @__PURE__ */ jsxRuntime.jsx(
        designSystem.JSONInput,
        {
          disabled: true,
          name: props.name,
          value: typeof field.value == "object" ? JSON.stringify(field.value, null, 2) : field.value,
          onChange: (e) => onSetLocation(e),
          style: { height: "9rem" }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Hint, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Field.Error, {})
  ] }) });
};
exports.default = Input;

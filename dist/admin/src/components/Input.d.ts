import React from 'react';
import 'leaflet/dist/leaflet.css';
interface Location {
    lat: number;
    lng: number;
}
interface InputProps {
    value: Location;
    [key: string]: any;
}
declare const Input: React.FC<InputProps>;
export default Input;

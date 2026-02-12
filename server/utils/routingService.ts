/*
  TODO: Transform this into a class
  and maybe add geocodingService to it.

  Rethink on how to arcthitecture it after
  building it
*/

const config = useRuntimeConfig();

function getRouting(geocodedAddress: number[]): any {
  const url = `${config.locationIq.apiUrl}/directions/driving/${geocodedAddress[0]};${geocodedAddress[1]}?key=${config.locationIq.apiKey}&steps=true&alternatives=true&geometries=polyline&overview=full`;
}
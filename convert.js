/**
 * Converts `MULTIPOLYGON (((0 1, 1 2, 2 3, 1 2, 0 1), (3 4, 4 5, 5 6, 4 5, 3 4)), ((6 7, 7 8, 8 9, 7 8, 6 7)))`
 * or `POLYGON ((0 1, 1 2, 2 3, 1 2, 0 1), (3 4, 4 5, 5 6, 4 5, 3 4), (6 7, 7 8, 8 9, 7 8, 6 7))`
 * to React Leaflet positions compatible multi dimensional array.
 *
 *  [
 *    [
 *      [['1', '0'], ['2', '1'], ['3', '2'], ['2', '1'], ['1', '0']],
 *      [['4', '3'], ['5', '4'], ['6', '5'], ['5', '4'], ['4', '3']]
 *    ],
 *    [
 *      [['7', '6'], ['8', '7'], ['9', '8'], ['8', '7'], ['7', '6']]
 *    ]
 * ]
 *
 * NOTE: Point value lat lng order reversed(0 1 to 1 0). Leaflet and PostGIS uses opposite orders.
 * 
 * @param {string} locationArea PostGIS Polygon, MultiPolygon string.
 * @return {array} lat lng points array
 */
export const convert = (locationArea = '') => {
  if (locationArea && (locationArea?.startsWith('MULTIPOLYGON') || locationArea?.startsWith('POLYGON'))) {
    const polygonsStr = locationArea.replace(/, /g, ',').replace(/ \(/g, '(');
    const polygons = polygonsStr.split(')),((');
    polygons[0] = polygons[0].replace('MULTIPOLYGON(((', '');
    polygons[0] = polygons[0].replace('POLYGON((', '');

    const lastIndex = polygons.length - 1;
    polygons[lastIndex] = polygons[lastIndex].replace(')))', '');
    polygons[lastIndex] = polygons[lastIndex].replace('))', '');

    for (let i = 0; i < polygons.length; i++) {
      polygons[i] = polygons[i]
        .split('),(')
        .map((points) => points.split(','))
        .map((points) => points.map((point) => point.split(' ').reverse()));
    }
    return polygons;
  }
  return [];
};

export default convert

/* eslint-disable no-template-curly-in-string */
import assert from 'assert';
import URLBuilder from '../../src/Provider/URLBuilder';
import Extent from '../../src/Core/Geographic/Extent';

const layer = {};

describe('URL creations', function () {
    it('should correctly replace ${x}, ${y} and ${z} by 359, 512 and 10', function () {
        var coords = new Extent('TMS', 10, 512, 359);
        layer.url = 'http://server.geo/tms/${z}/${y}/${x}.jpg';
        var result = URLBuilder.xyz(coords, layer);
        assert.equal(result, 'http://server.geo/tms/10/512/359.jpg');
    });

    it('should correctly replace %COL, %ROW, %TILEMATRIX by 2072, 1410 and 12', function () {
        var coords = new Extent('WMTS:WGS84', 12, 1410, 2072);
        layer.url = 'http://server.geo/wmts/SERVICE=WMTS&TILEMATRIX=%TILEMATRIX&TILEROW=%ROW&TILECOL=%COL';
        var result = URLBuilder.xyz(coords, layer);
        assert.equal(result, 'http://server.geo/wmts/SERVICE=WMTS&TILEMATRIX=12&TILEROW=1410&TILECOL=2072');
    });

    it('should correctly replace %bbox by 12,35,14,46', function () {
        var extent = new Extent('EPSG:4978', 12, 14, 35, 46);
        layer.projection = 'EPSG:4978';
        layer.url = 'http://server.geo/wms/BBOX=%bbox&FORMAT=jpg&SERVICE=WMS';
        var result = URLBuilder.bbox(extent, layer);
        assert.equal(result, 'http://server.geo/wms/BBOX=12.00,35.00,14.00,46.00&FORMAT=jpg&SERVICE=WMS');
    });

    it('should correctly replace %bbox by 12,14,35,46', function () {
        var extent = new Extent('EPSG:4326', 12, 14, 35, 46);
        layer.projection = 'EPSG:4326';
        layer.axisOrder = 'wesn';
        layer.url = 'http://server.geo/wms/BBOX=%bbox&FORMAT=jpg&SERVICE=WMS';
        var result = URLBuilder.bbox(extent, layer);
        assert.equal(result, 'http://server.geo/wms/BBOX=12.000000000,14.000000000,35.000000000,46.000000000&FORMAT=jpg&SERVICE=WMS');
    });

    it('shouldn\'t use the scientific notation', function () {
        var extent = new Extent('EPSG:4326', 1 / 9999999999, 14, 35, 46);
        layer.projection = 'EPSG:4326';
        layer.axisOrder = 'wesn';
        layer.url = 'http://bla/wms/BBOX=%bbox&FORMAT=jpg&SERVICE=WMS';
        var result = URLBuilder.bbox(extent, layer);
        assert.ok(result.indexOf('1e'), -1);
    });
});
